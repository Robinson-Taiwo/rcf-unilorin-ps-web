-- =====================================================================
-- RCF Unilorin PS — fourth migration: check in with Google
--   Members sign in with Google to check in: one check-in per Google account and per phone, with names.
--   Members share Supabase Auth with admins, so this also makes sure a member never becomes an admin.
-- Run after 20261020000000_access_checkin_transport.sql.
-- =====================================================================

-- Only invited people get an admin profile. Google sign-ins (members) get none, so they can't open the
-- dashboard and every admin policy (is_admin / has_module) says no to them.
create or replace function handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.invited_at is null and not (coalesce(new.raw_user_meta_data, '{}'::jsonb) ? 'role') then
    return new;
  end if;
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

-- Only admins write to the Activity Log (members are signed in too now)
create or replace function log_activity(p_action text, p_module log_module) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not is_admin() then return; end if;
  insert into activity_log (actor_id, action, module) values (auth.uid(), p_action, p_module);
end;
$$;

-- Who checked in
alter table checkins add column if not exists user_id uuid references auth.users (id) on delete set null;
alter table checkins add column if not exists member_name text;
alter table checkins add column if not exists member_email text;
create unique index if not exists checkins_one_per_account on checkins (session_id, user_id);

-- Returns 'ok', 'already', 'invalid' (wrong code / closed) or 'signin' (not signed in)
drop function if exists check_in(text, text, text);
create or replace function check_in(p_code text, p_device_id text, p_alt_id text default null) returns text
language plpgsql security definer set search_path = public as $$
declare s_id uuid; u auth.users;
begin
  if auth.uid() is null then return 'signin'; end if;
  if coalesce(p_device_id, '') = '' then return 'invalid'; end if;
  select * into u from auth.users where id = auth.uid();
  select id into s_id from checkin_sessions
   where code = upper(trim(p_code)) and is_open
     and service_date = (now() at time zone 'Africa/Lagos')::date
   limit 1;
  if s_id is null then return 'invalid'; end if;
  if exists (
    select 1 from checkins
     where session_id = s_id
       and (user_id = u.id or device_id in (p_device_id, coalesce(p_alt_id, p_device_id)))
  ) then
    return 'already';
  end if;
  insert into checkins (session_id, device_id, user_id, member_name, member_email)
  values (
    s_id, p_device_id, u.id,
    coalesce(u.raw_user_meta_data ->> 'full_name', u.raw_user_meta_data ->> 'name', split_part(u.email, '@', 1)),
    u.email
  )
  on conflict do nothing;
  return 'ok';
end;
$$;

-- Today's service this account or phone has already checked in to
drop function if exists my_checkin_today(text, text);
create or replace function my_checkin_today(p_device_id text, p_alt_id text default null) returns text
language sql stable security definer set search_path = public as $$
  select s.name
    from checkins c
    join checkin_sessions cs on cs.id = c.session_id
    join services s on s.key = cs.service_key
   where cs.service_date = (now() at time zone 'Africa/Lagos')::date
     and ((auth.uid() is not null and c.user_id = auth.uid())
          or c.device_id in (p_device_id, coalesce(p_alt_id, p_device_id)))
   order by c.created_at desc
   limit 1;
$$;

grant execute on function check_in(text, text, text) to anon, authenticated;
grant execute on function my_checkin_today(text, text) to anon, authenticated;
