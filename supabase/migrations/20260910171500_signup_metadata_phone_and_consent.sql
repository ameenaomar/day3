-- The sign-up form asks for a WhatsApp number and a marketing opt-in as well
-- as a name. All three are sent as user metadata, so the trigger has to read
-- them — otherwise the two extra fields are collected and silently dropped.
--
-- Names also have their whitespace collapsed here: btrim only strips the ends,
-- so "Noura   Al-Sabah" was stored with the run of spaces intact and printed
-- that way on the stylist's sheet. The form does the same, but metadata
-- reaches this function client-supplied, so the database is the only place
-- that can promise it.

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_name      text;
  v_locale    public."Locale";
  v_phone     text;
  v_marketing boolean;
begin
  -- No email, no customer record: everything downstream keys off it.
  if new.email is null then
    return new;
  end if;

  v_name := nullif(btrim(regexp_replace(coalesce(new.raw_user_meta_data ->> 'name', ''),
                                        '\s+', ' ', 'g')), '');
  v_name := coalesce(v_name, split_part(new.email, '@', 1));

  begin
    v_locale := coalesce(nullif(new.raw_user_meta_data ->> 'locale', ''), 'en')::public."Locale";
  exception when others then
    v_locale := 'en';
  end;

  -- Already E.164 by the time it gets here: the server action parses the eight
  -- digits and rejects anything that is not a Kuwait mobile. Re-checked rather
  -- than trusted, because metadata is client-supplied.
  v_phone := nullif(btrim(new.raw_user_meta_data ->> 'phone_e164'), '');
  if v_phone is not null and v_phone !~ '^\+965[569][0-9]{7}$' then
    v_phone := null;
  end if;

  v_marketing := coalesce((new.raw_user_meta_data ->> 'marketing_opt_in')::boolean, false);

  insert into public."Customer" as c
    (id, name, email, "phoneE164", locale, "marketingOptIn", "marketingOptInAt",
     "authUserId", "createdAt", "lastSeenAt")
  values
    (new.id::text, v_name, lower(new.email), v_phone, v_locale, v_marketing,
     case when v_marketing then now() else null end,
     new.id, now(), now())
  on conflict (email) do update
    -- A customer who existed before Supabase Auth (or who signed up twice with
    -- different casing) is adopted rather than duplicated. Their own values
    -- win; the metadata only fills a blank.
    set "authUserId"       = excluded."authUserId",
        name               = case when btrim(c.name) = '' then excluded.name else c.name end,
        "phoneE164"        = coalesce(c."phoneE164", excluded."phoneE164"),
        "marketingOptIn"   = c."marketingOptIn" or excluded."marketingOptIn",
        -- Stamped the first time consent is given, and never moved after.
        "marketingOptInAt" = coalesce(c."marketingOptInAt", excluded."marketingOptInAt"),
        "lastSeenAt"       = now();

  return new;
end;
$$;

revoke all on function public.handle_new_auth_user() from public, anon, authenticated;
