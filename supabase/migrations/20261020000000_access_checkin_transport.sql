-- =====================================================================
-- RCF Unilorin PS — third migration
--   1. Choose which pages each Admin can open (Super Admins still see everything)
--   2. One check-in per phone per service, with a clear "already checked in" answer
--   3. Cancel bookings to free seats; cancelled riders can book again
-- Run after the first two (SQL Editor → New query → paste → Run).
-- =====================================================================

-- ---------- 1. Page access per admin ----------
-- The pages an Admin can be given. Giving, Users & roles and the Activity Log stay Super Admin only.
alter table profiles
  add column if not exists modules text[] not null
  default array['check-in', 'transport', 'sermons', 'events', 'testimonies', 'messages'];

alter table profiles drop constraint if exists profiles_modules_check;
alter table profiles add constraint profiles_modules_check
  check (modules <@ array['check-in', 'transport', 'sermons', 'events', 'testimonies', 'messages']);

-- New invites can carry their page list in the invite metadata
create or replace function handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, email, full_name, role, status, modules)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce((new.raw_user_meta_data ->> 'role')::admin_role, 'admin'),
    'invited',
    coalesce(
      (select array_agg(m) from jsonb_array_elements_text(new.raw_user_meta_data -> 'modules') m),
      array['check-in', 'transport', 'sermons', 'events', 'testimonies', 'messages']
    )
  );
  return new;
end;
$$;

-- True when the signed-in admin is active and may use this page
create or replace function has_module(p_module text) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from profiles
     where id = auth.uid() and status = 'active'
       and (role = 'super_admin' or p_module = any (modules))
  );
$$;
grant execute on function has_module(text) to authenticated;

-- Check-in
drop policy if exists "admins manage sessions" on checkin_sessions;
drop policy if exists "admins read checkins" on checkins;
create policy "check-in admins manage sessions" on checkin_sessions for all using (has_module('check-in')) with check (has_module('check-in'));
create policy "check-in admins read checkins" on checkins for select using (has_module('check-in'));

-- Transport
drop policy if exists "admins add trips" on trips;
drop policy if exists "admins edit trips" on trips;
drop policy if exists "admins manage bookings" on bookings;
create policy "transport admins add trips" on trips for insert with check (has_module('transport'));
create policy "transport admins edit trips" on trips for update using (has_module('transport')) with check (has_module('transport'));
create policy "transport admins manage bookings" on bookings for all using (has_module('transport')) with check (has_module('transport'));

-- Sermons
drop policy if exists "read sermons" on sermons;
drop policy if exists "admins add sermons" on sermons;
drop policy if exists "admins edit sermons" on sermons;
create policy "read sermons" on sermons for select using (status = 'published' or has_module('sermons'));
create policy "sermon admins add" on sermons for insert with check (has_module('sermons'));
create policy "sermon admins edit" on sermons for update using (has_module('sermons')) with check (has_module('sermons'));

-- Events
drop policy if exists "read events" on events;
drop policy if exists "admins add events" on events;
drop policy if exists "admins edit events" on events;
create policy "read events" on events for select using (status = 'published' or has_module('events'));
create policy "event admins add" on events for insert with check (has_module('events'));
create policy "event admins edit" on events for update using (has_module('events')) with check (has_module('events'));

-- Testimonies & prayer
drop policy if exists "admins read submissions" on submissions;
drop policy if exists "admins review submissions" on submissions;
create policy "testimony admins read" on submissions for select using (has_module('testimonies'));
create policy "testimony admins review" on submissions for update using (has_module('testimonies')) with check (has_module('testimonies'));

-- Messages
drop policy if exists "admins read messages" on messages;
drop policy if exists "admins update messages" on messages;
drop policy if exists "admins reply" on message_replies;
create policy "message admins read" on messages for select using (has_module('messages'));
create policy "message admins update" on messages for update using (has_module('messages')) with check (has_module('messages'));
create policy "message admins reply" on message_replies for all using (has_module('messages')) with check (has_module('messages'));

-- Uploads: sermon audio needs Sermons; site images need Events (posters) or Super Admin (church needs)
drop policy if exists "admins upload media" on storage.objects;
drop policy if exists "admins update media" on storage.objects;
create policy "admins upload media" on storage.objects for insert with check (
  (bucket_id = 'sermon-audio' and has_module('sermons'))
  or (bucket_id = 'site-media' and (has_module('events') or has_module('sermons') or is_super_admin()))
);
create policy "admins update media" on storage.objects for update using (
  (bucket_id = 'sermon-audio' and has_module('sermons'))
  or (bucket_id = 'site-media' and (has_module('events') or has_module('sermons') or is_super_admin()))
);


-- ---------- 2. One check-in per phone ----------
-- Each phone has two ids: one in a cookie and one in the browser's storage. Clearing one isn't enough to
-- check in twice. Returns 'ok', 'already', or 'invalid' (wrong code, or check-in closed).
drop function if exists check_in(text, text);
create or replace function check_in(p_code text, p_device_id text, p_alt_id text default null) returns text
language plpgsql security definer set search_path = public as $$
declare s_id uuid;
begin
  if coalesce(p_device_id, '') = '' then return 'invalid'; end if;
  select id into s_id from checkin_sessions
   where code = upper(trim(p_code)) and is_open
     and service_date = (now() at time zone 'Africa/Lagos')::date
   limit 1;
  if s_id is null then return 'invalid'; end if;
  if exists (select 1 from checkins where session_id = s_id and device_id in (p_device_id, coalesce(p_alt_id, p_device_id))) then
    return 'already';
  end if;
  insert into checkins (session_id, device_id) values (s_id, p_device_id) on conflict do nothing;
  return 'ok';
end;
$$;

-- Which of today's services this phone has already checked in to (shown when the page opens)
create or replace function my_checkin_today(p_device_id text, p_alt_id text default null) returns text
language sql stable security definer set search_path = public as $$
  select s.name
    from checkins c
    join checkin_sessions cs on cs.id = c.session_id
    join services s on s.key = cs.service_key
   where cs.service_date = (now() at time zone 'Africa/Lagos')::date
     and c.device_id in (p_device_id, coalesce(p_alt_id, p_device_id))
   order by c.created_at desc
   limit 1;
$$;

grant execute on function check_in(text, text, text) to anon, authenticated;
grant execute on function my_checkin_today(text, text) to anon, authenticated;


-- ---------- 3. Cancelling bookings ----------
-- When a booking was cancelled; cancelled seats no longer count, so they open up for others
alter table bookings add column if not exists cancelled_at timestamptz;

-- Booking again after a cancellation brings the booking back (if there's still a seat).
-- Returns 'booked', 'already', 'full' or 'closed'.
create or replace function book_seat(p_trip_id uuid, p_name text, p_phone text) returns text
language plpgsql security definer set search_path = public as $$
declare t trips; taken int; existing bookings;
begin
  select * into t from trips where id = p_trip_id;
  if t.id is null or not t.is_open or t.departs_at < now() then return 'closed'; end if;
  select * into existing from bookings where trip_id = p_trip_id and phone = p_phone;
  if existing.id is not null and existing.status <> 'cancelled' then return 'already'; end if;
  select count(*) into taken from bookings where trip_id = p_trip_id and status <> 'cancelled';
  if taken >= t.seats then return 'full'; end if;
  if existing.id is not null then
    update bookings set status = 'booked', rider_name = p_name, cancelled_at = null, created_at = now() where id = existing.id;
  else
    insert into bookings (trip_id, rider_name, phone) values (p_trip_id, p_name, p_phone);
  end if;
  return 'booked';
end;
$$;
