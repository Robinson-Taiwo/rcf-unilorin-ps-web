-- =====================================================================
-- RCF Unilorin PS — second migration: sign-in helpers and starter data.
-- Run after 20261019000000_init.sql (SQL Editor → New query → paste → Run).
-- =====================================================================

-- An invited admin who has just set their password becomes active.
create or replace function activate_me() returns void
language sql security definer set search_path = public as $$
  update profiles set status = 'active', last_active_at = now()
   where id = auth.uid() and status = 'invited';
$$;

-- Called on sign-in so "Last active" on Users and roles stays current.
create or replace function touch_last_active() returns void
language sql security definer set search_path = public as $$
  update profiles set last_active_at = now() where id = auth.uid();
$$;

-- Lets a signed-in admin update their own display name (but not their role or status).
create or replace function set_my_name(p_name text) returns void
language sql security definer set search_path = public as $$
  update profiles set full_name = p_name where id = auth.uid();
$$;

grant execute on function activate_me() to authenticated;
grant execute on function touch_last_active() to authenticated;
grant execute on function set_my_name(text) to authenticated;

-- Starter "Other church needs" (images fall back to the site's bundled photos until you upload new ones)
insert into church_needs (name, visible, sort)
select * from (values
  ('Church bus fund', true, 1),
  ('Hostel outreach', true, 2),
  ('Media equipment', false, 3),
  ('Solar power', true, 4)
) as v(name, visible, sort)
where not exists (select 1 from church_needs);
