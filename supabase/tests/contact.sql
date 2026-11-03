-- Integration checks for a disposable/local database after the migration.
-- Run with psql -v ON_ERROR_STOP=1 -f supabase/tests/contact.sql.
-- All test data and counter changes are rolled back. Do not run on production.
begin;

do $$
begin
  if has_table_privilege('anon', 'public.qadam_contact_messages', 'select')
     or has_table_privilege('anon', 'public.qadam_contact_messages', 'insert')
     or has_table_privilege('authenticated', 'public.qadam_contact_messages', 'select')
     or has_table_privilege('authenticated', 'public.qadam_contact_messages', 'insert') then
    raise exception 'Contact message privileges exposed to a browser role';
  end if;
  if has_function_privilege('anon', 'public.receive_contact_message(text,text,text,text,text,text)', 'execute')
     or has_function_privilege('authenticated', 'public.receive_contact_message(text,text,text,text,text,text)', 'execute') then
    raise exception 'Contact RPC exposed to a browser role';
  end if;
  if not (select relrowsecurity from pg_class where oid = 'public.qadam_contact_messages'::regclass)
     or not (select relrowsecurity from pg_class where oid = 'qadam_private.contact_rate_limits'::regclass) then
    raise exception 'RLS must be enabled';
  end if;
end;
$$;

delete from qadam_private.contact_rate_limits;
set local role service_role;
select public.receive_contact_message('Test Partner', 'SQL-TEST@example.invalid', 'Engineer', 'Local integration test.', repeat('a', 64), repeat('b', 64));
reset role;

do $$
declare
  v_result jsonb;
  v_count integer;
  v_i integer;
begin
  if not exists (select 1 from public.qadam_contact_messages where email = 'sql-test@example.invalid' and created_at is not null) then
    raise exception 'Service RPC did not save a normalized message and timestamp';
  end if;

  -- The third per-email message succeeds; the fourth is rejected with no insert.
  for v_i in 2..3 loop
    v_result := public.receive_contact_message('Test', 'sql-test@example.invalid', 'Engineer', 'Email limit test.', repeat('a', 64), repeat('b', 64));
    if not (v_result->>'accepted')::boolean then raise exception 'Email limit rejected too early'; end if;
  end loop;
  select count(*) into v_count from public.qadam_contact_messages;
  v_result := public.receive_contact_message('Test', 'sql-test@example.invalid', 'Engineer', 'Must not be stored.', repeat('a', 64), repeat('b', 64));
  if (v_result->>'accepted')::boolean or (v_result->>'retry_after')::integer < 1 then raise exception 'Email limit failed'; end if;
  if (select count(*) from public.qadam_contact_messages) <> v_count then raise exception 'Rejected message was inserted'; end if;

  -- A fresh client with different emails reaches its five-message IP limit.
  delete from qadam_private.contact_rate_limits;
  for v_i in 1..5 loop
    v_result := public.receive_contact_message('Test', 'ip-test@example.invalid', 'Engineer', 'IP limit test.', repeat('c', 64), md5(v_i::text) || md5(v_i::text));
    if not (v_result->>'accepted')::boolean then raise exception 'IP limit rejected too early'; end if;
  end loop;
  v_result := public.receive_contact_message('Test', 'ip-test@example.invalid', 'Engineer', 'Must not be stored.', repeat('c', 64), repeat('d', 64));
  if (v_result->>'accepted')::boolean then raise exception 'IP limit failed'; end if;

  -- Expired windows reset instead of permanently blocking the client.
  update qadam_private.contact_rate_limits set resets_at = now() - interval '1 second';
  v_result := public.receive_contact_message('Test', 'ip-test@example.invalid', 'Engineer', 'Reset limit test.', repeat('c', 64), repeat('d', 64));
  if not (v_result->>'accepted')::boolean then raise exception 'Expired window did not reset'; end if;

  -- A global cap remains effective even when both fingerprints change.
  delete from qadam_private.contact_rate_limits;
  insert into qadam_private.contact_rate_limits values ('global', 100, now() + interval '1 hour');
  v_result := public.receive_contact_message('Test', 'global@example.invalid', 'Engineer', 'Must not be stored.', repeat('e', 64), repeat('f', 64));
  if (v_result->>'accepted')::boolean then raise exception 'Global limit failed'; end if;

  begin
    perform public.receive_contact_message('Test', 'bad@example.invalid', 'Engineer', 'Invalid fingerprint.', 'not-a-hash', repeat('f', 64));
    raise exception 'Invalid fingerprint was accepted';
  exception when invalid_parameter_value then
    null;
  end;
end;
$$;

rollback;
