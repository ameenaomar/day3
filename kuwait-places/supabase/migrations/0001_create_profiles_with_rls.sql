-- Profiles for Yalla, where to?
--
-- Passwords are deliberately NOT here. Supabase Auth owns them in auth.users,
-- hashed with bcrypt, and no application code ever sees them. A table of our
-- own holding passwords — even hashed by us — would be strictly worse.
-- This table holds the one thing Auth does not: the display name.

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 2 and 60),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is
  'Display name per user. Credentials live in auth.users, never here.';

alter table public.profiles enable row level security;

-- Every policy is scoped to the row's own owner. The publishable key is public
-- by design, so RLS is the only thing between one user and another's row.
create policy profiles_select_own on public.profiles
  for select to authenticated using ((select auth.uid()) = id);

create policy profiles_insert_own on public.profiles
  for insert to authenticated with check ((select auth.uid()) = id);

create policy profiles_update_own on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- No delete policy on purpose: removing the auth user cascades to the profile.

-- Create the profile inside the signup transaction rather than in a second
-- client call, so a client that dies mid-signup can't leave a nameless user.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, name)
  values (
    new.id,
    coalesce(
      nullif(btrim(new.raw_user_meta_data ->> 'name'), ''),
      split_part(new.email, '@', 1)
    )
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger profiles_touch_updated_at
  before update on public.profiles
  for each row execute function public.touch_updated_at();
