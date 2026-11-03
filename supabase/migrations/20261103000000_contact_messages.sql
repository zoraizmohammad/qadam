-- This migration only creates Qadam-owned objects. It does not change grants on
-- unrelated tables or expose visitor messages through the public Data API.
create schema if not exists qadam_private;
revoke all on schema qadam_private from public, anon, authenticated;

create table public.qadam_contact_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(btrim(name)) between 1 and 120),
  email text not null check (char_length(email) between 3 and 254),
  role text not null check (role in (
    'Engineer', 'Clinician / Prosthetist (CPO)', 'Funder / Partner',
    'Field partner (NGO / clinic)', 'Other / just interested'
  )),
  message text not null check (char_length(btrim(message)) between 1 and 4000)
);

alter table public.qadam_contact_messages enable row level security;
revoke all on public.qadam_contact_messages from public, anon, authenticated;
grant select, insert, update, delete on public.qadam_contact_messages to service_role;
create index qadam_contact_messages_created_at_idx on public.qadam_contact_messages (created_at desc);

create table qadam_private.contact_rate_limits (
  bucket text primary key,
  attempts integer not null check (attempts > 0),
  resets_at timestamptz not null
);
alter table qadam_private.contact_rate_limits enable row level security;
revoke all on qadam_private.contact_rate_limits from public, anon, authenticated;

-- One RPC transaction checks limits and inserts the message. The global bucket
-- is locked first so concurrent Edge Function isolates cannot race the counters.
create function public.receive_contact_message(
  p_name text,
  p_email text,
  p_role text,
  p_message text,
  p_ip_hash text,
  p_email_hash text
) returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_now timestamptz := now();
  v_bucket text;
  v_limit integer;
  v_attempts integer;
  v_resets_at timestamptz;
  v_index integer;
begin
  if p_ip_hash is null or p_email_hash is null
     or p_ip_hash !~ '^[0-9a-f]{64}$' or p_email_hash !~ '^[0-9a-f]{64}$' then
    raise exception 'Invalid rate-limit fingerprint' using errcode = '22023';
  end if;

  for v_index in 1..3 loop
    v_bucket := case v_index when 1 then 'global' when 2 then 'ip:' || p_ip_hash else 'email:' || p_email_hash end;
    v_limit := case v_index when 1 then 100 when 2 then 5 else 3 end;
    insert into qadam_private.contact_rate_limits as limits (bucket, attempts, resets_at)
    values (v_bucket, 1, v_now + interval '1 hour')
    on conflict (bucket) do update set
      attempts = case when limits.resets_at <= v_now then 1 else limits.attempts + 1 end,
      resets_at = case when limits.resets_at <= v_now then v_now + interval '1 hour' else limits.resets_at end
    returning attempts, resets_at into v_attempts, v_resets_at;

    if v_attempts > v_limit then
      return jsonb_build_object('accepted', false, 'retry_after', greatest(1, ceil(extract(epoch from (v_resets_at - v_now)))));
    end if;
  end loop;

  insert into public.qadam_contact_messages (name, email, role, message)
  values (btrim(p_name), lower(btrim(p_email)), p_role, btrim(p_message));

  -- Expired fingerprints have no operational value. Cleanup also bounds growth
  -- without requiring a paid scheduler or persisting plaintext client addresses.
  delete from qadam_private.contact_rate_limits where resets_at < v_now - interval '1 day';
  return jsonb_build_object('accepted', true);
end;
$$;

revoke all on function public.receive_contact_message(text, text, text, text, text, text) from public, anon, authenticated;
grant execute on function public.receive_contact_message(text, text, text, text, text, text) to service_role;

comment on table public.qadam_contact_messages is 'Private Qadam contact enquiries. Not patient or clinical records.';
comment on function public.receive_contact_message(text, text, text, text, text, text) is 'Service-only contact ingestion: atomic hourly limits and message insert.';
