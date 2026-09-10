-- Sign-up and sign-in are Supabase Auth. auth.users owns the credential and the
-- session; public."Customer" stays the app's customer record, and this links the
-- two so a signed-in user resolves to exactly one customer row.

alter table public."Customer"
  add column if not exists "authUserId" uuid unique
    references auth.users (id) on delete set null;

comment on column public."Customer"."authUserId" is
  'The Supabase Auth user this customer signs in as. Set by the on_auth_user_created trigger.';

-- A customer row per new auth user, created inside the signup transaction so
-- the client never has to make a second, failable write. security definer
-- because the caller during signup is the auth service, not a table owner.
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_name   text;
  v_locale public."Locale";
begin
  -- No email, no customer record: everything downstream keys off it.
  if new.email is null then
    return new;
  end if;

  v_name := coalesce(nullif(btrim(new.raw_user_meta_data ->> 'name'), ''),
                     split_part(new.email, '@', 1));

  begin
    v_locale := coalesce(nullif(new.raw_user_meta_data ->> 'locale', ''), 'en')::public."Locale";
  exception when others then
    v_locale := 'en';
  end;

  insert into public."Customer" as c
    (id, name, email, locale, "authUserId", "createdAt", "lastSeenAt")
  values
    (new.id::text, v_name, lower(new.email), v_locale, new.id, now(), now())
  on conflict (email) do update
    -- A customer who existed before Supabase Auth (or who signed up twice with
    -- different casing) is adopted rather than duplicated. Their own name wins;
    -- the metadata name only fills a blank.
    set "authUserId" = excluded."authUserId",
        name         = case when btrim(c.name) = '' then excluded.name else c.name end,
        "lastSeenAt" = now();

  return new;
end;
$$;

revoke all on function public.handle_new_auth_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

-- Row level security: everything in this schema is deny-by-default. These are
-- the first policies, and they say only "a signed-in customer can see and edit
-- their own row". anon is granted nothing at all.
grant select on public."Customer" to authenticated;
grant update ("name", "phoneE164", "locale", "marketingOptIn", "marketingOptInAt")
  on public."Customer" to authenticated;

drop policy if exists "Customers read their own row" on public."Customer";
create policy "Customers read their own row"
  on public."Customer" for select to authenticated
  using ("authUserId" = auth.uid());

drop policy if exists "Customers update their own row" on public."Customer";
create policy "Customers update their own row"
  on public."Customer" for update to authenticated
  using ("authUserId" = auth.uid())
  with check ("authUserId" = auth.uid());
