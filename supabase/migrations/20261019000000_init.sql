-- =====================================================================
-- RCF Unilorin PS — database schema (Supabase / Postgres)
-- Run once in Supabase: SQL Editor → New query → paste → Run.
--
-- Roles follow the Figma "Roles & Permissions" frame:
--   super_admin — everything
--   admin       — day-to-day modules; no Giving, Users & roles, Activity log, or deleting content
-- RLS (Row Level Security) enforces this in the database, so it holds even if the UI has a bug.
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------- Admin profiles (one per Supabase Auth user) ----------

create type admin_role as enum ('super_admin', 'admin');
create type admin_status as enum ('active', 'invited', 'inactive');

create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  email text not null unique,
  role admin_role not null default 'admin',
  status admin_status not null default 'invited',
  last_active_at timestamptz,
  created_at timestamptz not null default now()
);

-- Helpers used by the policies below
create or replace function is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid() and status = 'active');
$$;

create or replace function is_super_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid() and status = 'active' and role = 'super_admin');
$$;

-- New auth users (from an invite) get a profile automatically
create or replace function handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, email, full_name, role, status)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce((new.raw_user_meta_data ->> 'role')::admin_role, 'admin'),
    'invited'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ---------- Activity log (insert-only; nobody can edit or delete entries) ----------

create type log_module as enum ('content', 'giving', 'check-in', 'users', 'transport', 'testimonies', 'messages');

create table activity_log (
  id bigint generated always as identity primary key,
  actor_id uuid references profiles (id) on delete set null,
  action text not null,
  module log_module not null,
  created_at timestamptz not null default now()
);

create or replace function log_activity(p_action text, p_module log_module) returns void
language sql security definer set search_path = public as $$
  insert into activity_log (actor_id, action, module) values (auth.uid(), p_action, p_module);
$$;

-- ---------- Check-in ----------

create table services (
  key text primary key,                -- 'sunday' | 'tuesday' | 'thursday'
  name text not null,                  -- 'Sunday Service'
  time_label text not null,            -- '7:20 AM WAT'
  sort int not null default 0
);

insert into services (key, name, time_label, sort) values
  ('sunday', 'Sunday Service', '7:20 AM WAT', 1),
  ('tuesday', 'Tuesday Bible Study', '6:15 PM WAT', 2),
  ('thursday', 'Thursday Prayer Meeting', '6:15 PM WAT', 3);

-- One row per service per day: the code announced and whether check-in is open
create table checkin_sessions (
  id uuid primary key default gen_random_uuid(),
  service_key text not null references services (key),
  service_date date not null default (now() at time zone 'Africa/Lagos')::date,
  code text not null check (code ~ '^[0-9A-Z]{3}$'),
  is_open boolean not null default true,
  created_by uuid references profiles (id),
  created_at timestamptz not null default now(),
  unique (service_key, service_date)
);

create table checkins (
  id bigint generated always as identity primary key,
  session_id uuid not null references checkin_sessions (id) on delete cascade,
  device_id text,                      -- random id kept in the member's browser, stops double counting
  created_at timestamptz not null default now(),
  unique (session_id, device_id)
);

-- Public check-in page calls this with the 3-character code. Returns true when counted.
create or replace function check_in(p_code text, p_device_id text) returns boolean
language plpgsql security definer set search_path = public as $$
declare s_id uuid;
begin
  select id into s_id from checkin_sessions
   where code = upper(p_code) and is_open
     and service_date = (now() at time zone 'Africa/Lagos')::date
   limit 1;
  if s_id is null then return false; end if;
  insert into checkins (session_id, device_id) values (s_id, p_device_id) on conflict do nothing;
  return true;
end;
$$;

-- ---------- Transport ----------

create type trip_direction as enum ('school_to_church', 'church_to_school');
create type booking_status as enum ('booked', 'boarded', 'no_show', 'cancelled');

create table trips (
  id uuid primary key default gen_random_uuid(),
  direction trip_direction not null,
  departs_at timestamptz not null,
  pickup text not null,
  seats int not null check (seats > 0),
  is_open boolean not null default true,
  created_by uuid references profiles (id),
  created_at timestamptz not null default now()
);

create table bookings (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references trips (id) on delete cascade,
  rider_name text not null,
  phone text not null,
  status booking_status not null default 'booked',
  created_at timestamptz not null default now(),
  unique (trip_id, phone)
);

-- Public booking: checks the trip is open and not full
create or replace function book_seat(p_trip_id uuid, p_name text, p_phone text) returns text
language plpgsql security definer set search_path = public as $$
declare t trips; taken int;
begin
  select * into t from trips where id = p_trip_id;
  if t.id is null or not t.is_open or t.departs_at < now() then return 'closed'; end if;
  select count(*) into taken from bookings where trip_id = p_trip_id and status <> 'cancelled';
  if taken >= t.seats then return 'full'; end if;
  insert into bookings (trip_id, rider_name, phone) values (p_trip_id, p_name, p_phone)
    on conflict (trip_id, phone) do nothing;
  return 'booked';
end;
$$;

-- Seats left per trip, safe for the public page (no rider details)
create view trip_availability with (security_invoker = false) as
  select t.id, t.direction, t.departs_at, t.pickup, t.seats, t.is_open,
         t.seats - count(b.id) filter (where b.status <> 'cancelled') as seats_left
    from trips t left join bookings b on b.trip_id = t.id
   group by t.id;

-- ---------- Giving ----------

create table giving_accounts (
  kind text primary key check (kind in ('offerings', 'tithe', 'project')),
  bank text not null,
  account_name text not null,
  account_number text not null,
  updated_by uuid references profiles (id),
  updated_at timestamptz not null default now()
);

insert into giving_accounts (kind, bank, account_name, account_number) values
  ('offerings', 'First Bank', 'RCF Unilorin', '0123456789'),
  ('tithe', 'First Bank', 'RCF Unilorin', '0123456789'),
  ('project', 'First Bank', 'RCF Unilorin', '0123456789');

-- Every account change is logged automatically
create or replace function log_giving_change() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into activity_log (actor_id, action, module)
  values (auth.uid(), format('Changed %s account details', initcap(new.kind)), 'giving');
  return new;
end;
$$;

create trigger giving_accounts_logged after update on giving_accounts
  for each row execute function log_giving_change();

create table church_needs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  image_path text,                     -- file in the 'site-media' storage bucket
  visible boolean not null default true,
  sort int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- Sermons & Events ----------

create type content_status as enum ('draft', 'published');

create table sermons (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  speaker text,
  preached_on date,
  audio_path text,                     -- file in the 'sermon-audio' storage bucket
  duration_seconds int,
  image_path text,
  status content_status not null default 'draft',
  created_by uuid references profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  starts_at timestamptz,
  place text,
  description text,
  poster_path text,                    -- file in the 'site-media' storage bucket
  featured boolean not null default false,
  status content_status not null default 'draft',
  created_by uuid references profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- Testimonies & prayer requests (from the Share Your Story form) ----------

create type submission_type as enum ('testimony', 'prayer');
create type submission_status as enum ('pending', 'approved', 'rejected', 'prayed');

create table submissions (
  id uuid primary key default gen_random_uuid(),
  type submission_type not null,
  name text,
  anonymous boolean not null default false,
  message text not null check (char_length(message) <= 600),
  contact text,                        -- never shown publicly
  status submission_status not null default 'pending',
  reviewed_by uuid references profiles (id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

-- Approved testimonies for the About page — no contact details, names hidden when anonymous
create view published_testimonies with (security_invoker = false) as
  select id, case when anonymous or coalesce(name, '') = '' then 'Anonymous' else name end as display_name,
         message, reviewed_at
    from submissions
   where type = 'testimony' and status = 'approved';

-- ---------- Messages (Contact page inbox) ----------

create table messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  body text not null,
  is_read boolean not null default false,
  archived boolean not null default false,
  created_at timestamptz not null default now()
);

create table message_replies (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references messages (id) on delete cascade,
  body text not null,
  sent_by uuid references profiles (id),
  created_at timestamptz not null default now()
);

-- =====================================================================
-- Row Level Security
-- =====================================================================

alter table profiles enable row level security;
alter table activity_log enable row level security;
alter table services enable row level security;
alter table checkin_sessions enable row level security;
alter table checkins enable row level security;
alter table trips enable row level security;
alter table bookings enable row level security;
alter table giving_accounts enable row level security;
alter table church_needs enable row level security;
alter table sermons enable row level security;
alter table events enable row level security;
alter table submissions enable row level security;
alter table messages enable row level security;
alter table message_replies enable row level security;

-- Profiles: admins read all (for avatars/names); Super Admin manages; everyone can read their own row
create policy "admins read profiles" on profiles for select using (is_admin() or id = auth.uid());
create policy "super admin manages profiles" on profiles for all using (is_super_admin()) with check (is_super_admin());

-- Activity log: Super Admin reads; nobody updates or deletes (no policies for them)
create policy "super admin reads log" on activity_log for select using (is_super_admin());
create policy "admins write log" on activity_log for insert with check (is_admin());

-- Check-in: admins manage; the public goes through check_in()
create policy "anyone reads services" on services for select using (true);
create policy "admins manage sessions" on checkin_sessions for all using (is_admin()) with check (is_admin());
create policy "admins read checkins" on checkins for select using (is_admin());

-- Transport: admins manage trips and bookings; only Super Admin deletes a trip
create policy "anyone reads trips" on trips for select using (true);
create policy "admins add trips" on trips for insert with check (is_admin());
create policy "admins edit trips" on trips for update using (is_admin()) with check (is_admin());
create policy "super admin deletes trips" on trips for delete using (is_super_admin());
create policy "admins manage bookings" on bookings for all using (is_admin()) with check (is_admin());

-- Giving: public reads; Super Admin only changes
create policy "anyone reads giving" on giving_accounts for select using (true);
create policy "super admin edits giving" on giving_accounts for update using (is_super_admin()) with check (is_super_admin());
create policy "anyone reads visible needs" on church_needs for select using (visible or is_admin());
create policy "super admin manages needs" on church_needs for all using (is_super_admin()) with check (is_super_admin());

-- Sermons & Events: public reads published; admins add/edit; only Super Admin deletes
create policy "read sermons" on sermons for select using (status = 'published' or is_admin());
create policy "admins add sermons" on sermons for insert with check (is_admin());
create policy "admins edit sermons" on sermons for update using (is_admin()) with check (is_admin());
create policy "super admin deletes sermons" on sermons for delete using (is_super_admin());

create policy "read events" on events for select using (status = 'published' or is_admin());
create policy "admins add events" on events for insert with check (is_admin());
create policy "admins edit events" on events for update using (is_admin()) with check (is_admin());
create policy "super admin deletes events" on events for delete using (is_super_admin());

-- Submissions: anyone can send one (always starts pending); only admins read/review
create policy "anyone submits" on submissions for insert with check (status = 'pending' and reviewed_by is null);
create policy "admins read submissions" on submissions for select using (is_admin());
create policy "admins review submissions" on submissions for update using (is_admin()) with check (is_admin());

-- Messages: anyone can send; admins read, mark read, archive, reply
create policy "anyone sends messages" on messages for insert with check (is_read = false and archived = false);
create policy "admins read messages" on messages for select using (is_admin());
create policy "admins update messages" on messages for update using (is_admin()) with check (is_admin());
create policy "admins reply" on message_replies for all using (is_admin()) with check (is_admin());

-- Public functions and views
grant execute on function check_in(text, text) to anon, authenticated;
grant execute on function book_seat(uuid, text, text) to anon, authenticated;
grant execute on function log_activity(text, log_module) to authenticated;
grant select on trip_availability to anon, authenticated;
grant select on published_testimonies to anon, authenticated;

-- =====================================================================
-- Storage buckets (public read; admins upload)
-- =====================================================================

insert into storage.buckets (id, name, public) values
  ('sermon-audio', 'sermon-audio', true),
  ('site-media', 'site-media', true)
on conflict (id) do nothing;

create policy "public reads media" on storage.objects for select
  using (bucket_id in ('sermon-audio', 'site-media'));
create policy "admins upload media" on storage.objects for insert
  with check (bucket_id in ('sermon-audio', 'site-media') and is_admin());
create policy "admins update media" on storage.objects for update
  using (bucket_id in ('sermon-audio', 'site-media') and is_admin());
create policy "super admin deletes media" on storage.objects for delete
  using (bucket_id in ('sermon-audio', 'site-media') and is_super_admin());
