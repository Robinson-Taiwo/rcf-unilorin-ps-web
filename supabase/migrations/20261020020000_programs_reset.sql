-- =====================================================================
-- RCF Unilorin PS — fifth migration: other programs + resetting a day's check-in
--   • Check-In admins can add programs besides the three weekly services (vigils, conferences, outreaches…)
--     and hide ones that are over. Hidden programs keep their attendance history.
--   • Check-In admins can reset a day's check-in (removes that day's code and its check-ins).
--   • Several programs on the same day: a member checked in to one can still check in to the next.
-- Run after 20261020010000_google_checkin.sql.
-- =====================================================================

alter table services add column if not exists active boolean not null default true;
alter table services add column if not exists created_by uuid references profiles (id) on delete set null;
alter table services add column if not exists created_at timestamptz not null default now();

create policy "check-in admins add programs" on services for insert with check (has_module('check-in'));
create policy "check-in admins edit programs" on services for update using (has_module('check-in')) with check (has_module('check-in'));
-- (No delete: programs are hidden instead, so old attendance keeps its name.)

-- Resetting a day = deleting its session; its check-ins go with it (on delete cascade).
-- The existing "check-in admins manage sessions" policy already allows this.

-- On opening the check-in page: say "already checked in" only when there's no open session today
-- that this account / phone hasn't checked in to yet.
drop function if exists my_checkin_today(text, text);
create or replace function my_checkin_today(p_device_id text, p_alt_id text default null) returns text
language plpgsql stable security definer set search_path = public as $$
declare done_name text;
begin
  if exists (
    select 1 from checkin_sessions cs
     where cs.service_date = (now() at time zone 'Africa/Lagos')::date and cs.is_open
       and not exists (
         select 1 from checkins c
          where c.session_id = cs.id
            and ((auth.uid() is not null and c.user_id = auth.uid())
                 or c.device_id in (p_device_id, coalesce(p_alt_id, p_device_id)))
       )
  ) then
    return null;
  end if;

  select s.name into done_name
    from checkins c
    join checkin_sessions cs on cs.id = c.session_id
    join services s on s.key = cs.service_key
   where cs.service_date = (now() at time zone 'Africa/Lagos')::date
     and ((auth.uid() is not null and c.user_id = auth.uid())
          or c.device_id in (p_device_id, coalesce(p_alt_id, p_device_id)))
   order by c.created_at desc
   limit 1;
  return done_name;
end;
$$;
grant execute on function my_checkin_today(text, text) to anon, authenticated;
