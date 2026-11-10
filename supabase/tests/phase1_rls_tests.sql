-- ==============================================================================
-- Test Suite: Phase 1 RLS, Constraints, Triggers & RPC Security
-- File: supabase/tests/phase1_rls_tests.sql
-- Description: Verifies all security invariants and amendments for Phase 1.
-- Usage: Run this script in the Supabase SQL Editor on a DEV database.
--        The entire script is enclosed in BEGIN ... ROLLBACK, meaning
--        it leaves zero test artifacts in your database upon completion.
--        Results are returned as rows from the test_results temporary table.
-- ==============================================================================

BEGIN;

-- Temporary table to capture test outcomes as structured rows
CREATE TEMP TABLE test_results (
  id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  test_name text NOT NULL,
  passed boolean NOT NULL,
  detail text
);
GRANT ALL ON test_results TO PUBLIC;

DO $$
DECLARE
  v_user_a UUID := '11111111-1111-1111-1111-111111111111';
  v_user_b UUID := '22222222-2222-2222-2222-222222222222';
  v_admin_id UUID := '99999999-9999-9999-9999-999999999999';
  v_app public.internship_applications;
  v_cancelled_app public.internship_applications;
  v_notif_body TEXT;
  v_count INTEGER;
  v_err_caught BOOLEAN;
  v_sqlstate TEXT;
  v_err_msg TEXT;
BEGIN
  -- ----------------------------------------------------------------------------
  -- SETUP FIXTURES (run in postgres/service_role context)
  -- ----------------------------------------------------------------------------
  EXECUTE 'SET LOCAL ROLE postgres';
  PERFORM set_config('request.jwt.claims', '', true);

  -- 1. Create mock users in auth.users (fires handle_new_user trigger)
  INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at)
  VALUES 
    (v_user_a, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'student_a@test.com', 'dummy_hash', now(), '{"full_name": "Student A", "mobile": "+919876543210"}'::jsonb, now(), now()),
    (v_user_b, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'student_b@test.com', 'dummy_hash', now(), '{"full_name": "Student B", "mobile": "+919876543211"}'::jsonb, now(), now()),
    (v_admin_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'admin@test.com', 'dummy_hash', now(), '{"full_name": "Admin User"}'::jsonb, now(), now())
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    raw_user_meta_data = EXCLUDED.raw_user_meta_data;

  -- 2. Explicitly update profiles with DO UPDATE SET (do not set user_type to admin)
  INSERT INTO public.profiles (user_id, full_name, mobile)
  VALUES 
    (v_user_a, 'Student A', '+919876543210'),
    (v_user_b, 'Student B', '+919876543211'),
    (v_admin_id, 'Admin User', NULL)
  ON CONFLICT (user_id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    mobile = EXCLUDED.mobile;

  -- 3. Set admin authority strictly in user_roles table
  INSERT INTO public.user_roles (user_id, role)
  VALUES 
    (v_user_a, 'student'),
    (v_user_b, 'student'),
    (v_admin_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;

  -- 4. Set student_profiles education fields with DO UPDATE SET
  INSERT INTO public.student_profiles (user_id, college, degree, academic_year)
  VALUES 
    (v_user_a, 'ABC Tech Institute', 'B.Tech CSE', 3),
    (v_user_b, 'XYZ University', 'B.Sc IT', 2)
  ON CONFLICT (user_id) DO UPDATE SET
    college = EXCLUDED.college,
    degree = EXCLUDED.degree,
    academic_year = EXCLUDED.academic_year;

  -- 5. Verify education_completed flag was computed properly for student_a
  SELECT count(*) INTO v_count FROM public.student_profiles 
  WHERE user_id = v_user_a AND education_completed = true;
  IF v_count <> 1 THEN
    INSERT INTO test_results (test_name, passed, detail) 
    VALUES ('Setup Fixtures: education_completed', false, 'education_completed flag was not computed as true');
  ELSE
    INSERT INTO test_results (test_name, passed, detail)
    VALUES ('Setup Fixtures: education_completed', true, 'Fixtures created; student A education_completed = true');
  END IF;

  -- ----------------------------------------------------------------------------
  -- TEST 1: Student profile tenant isolation
  -- ----------------------------------------------------------------------------
  BEGIN
    EXECUTE 'SET LOCAL ROLE authenticated';
    PERFORM set_config('request.jwt.claims', json_build_object('sub', v_user_a::text, 'role', 'authenticated')::text, true);

    SELECT count(*) INTO v_count FROM public.student_profiles WHERE user_id = v_user_a;
    IF v_count <> 1 THEN
      RAISE EXCEPTION 'Student A could not select own profile';
    END IF;

    SELECT count(*) INTO v_count FROM public.student_profiles WHERE user_id = v_user_b;
    IF v_count <> 0 THEN
      RAISE EXCEPTION 'Student A was able to select Student B profile';
    END IF;

    UPDATE public.student_profiles SET branch = 'Computer Science' WHERE user_id = v_user_a;
    GET DIAGNOSTICS v_count = ROW_COUNT;
    IF v_count <> 1 THEN
      RAISE EXCEPTION 'Student A could not update own profile branch';
    END IF;

    UPDATE public.student_profiles SET branch = 'Hacked' WHERE user_id = v_user_b;
    GET DIAGNOSTICS v_count = ROW_COUNT;
    IF v_count <> 0 THEN
      RAISE EXCEPTION 'Student A updated Student B profile via RLS bypass';
    END IF;

    INSERT INTO test_results (test_name, passed, detail)
    VALUES ('Test 1: Student Profile Isolation', true, 'Student A can select/update own profile; cross-tenant access to Student B returns 0 rows');
  EXCEPTION WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_sqlstate = RETURNED_SQLSTATE;
    INSERT INTO test_results (test_name, passed, detail)
    VALUES ('Test 1: Student Profile Isolation', false, 'SQLSTATE ' || v_sqlstate || ': ' || SQLERRM);
  END;

  -- ----------------------------------------------------------------------------
  -- TEST 2: Student profile immutability (user_id & student_code)
  -- ----------------------------------------------------------------------------
  BEGIN
    EXECUTE 'SET LOCAL ROLE authenticated';
    PERFORM set_config('request.jwt.claims', json_build_object('sub', v_user_a::text, 'role', 'authenticated')::text, true);

    v_err_caught := false;
    v_sqlstate := '';
    BEGIN
      UPDATE public.student_profiles SET student_code = 'AAD-9999-999999' WHERE user_id = v_user_a;
    EXCEPTION WHEN OTHERS THEN
      GET STACKED DIAGNOSTICS v_sqlstate = RETURNED_SQLSTATE;
      IF v_sqlstate = '42501' THEN
        v_err_caught := true;
      END IF;
    END;
    IF NOT v_err_caught THEN
      RAISE EXCEPTION 'Modifying student_code did not raise 42501 (got SQLSTATE %)', v_sqlstate;
    END IF;

    v_err_caught := false;
    v_sqlstate := '';
    BEGIN
      UPDATE public.student_profiles SET user_id = v_user_b WHERE user_id = v_user_a;
    EXCEPTION WHEN OTHERS THEN
      GET STACKED DIAGNOSTICS v_sqlstate = RETURNED_SQLSTATE;
      IF v_sqlstate = '42501' THEN
        v_err_caught := true;
      END IF;
    END;
    IF NOT v_err_caught THEN
      RAISE EXCEPTION 'Modifying user_id did not raise 42501 (got SQLSTATE %)', v_sqlstate;
    END IF;

    INSERT INTO test_results (test_name, passed, detail)
    VALUES ('Test 2: Student Profile Immutability', true, 'Modifying user_id or student_code is blocked with SQLSTATE 42501');
  EXCEPTION WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_sqlstate = RETURNED_SQLSTATE;
    INSERT INTO test_results (test_name, passed, detail)
    VALUES ('Test 2: Student Profile Immutability', false, 'SQLSTATE ' || v_sqlstate || ': ' || SQLERRM);
  END;

  -- ----------------------------------------------------------------------------
  -- TEST 3: Privilege escalation protection (user_type & user_roles)
  -- ----------------------------------------------------------------------------
  BEGIN
    EXECUTE 'SET LOCAL ROLE authenticated';
    PERFORM set_config('request.jwt.claims', json_build_object('sub', v_user_a::text, 'role', 'authenticated')::text, true);

    v_err_caught := false;
    v_sqlstate := '';
    BEGIN
      UPDATE public.profiles SET user_type = 'admin' WHERE user_id = v_user_a;
    EXCEPTION WHEN OTHERS THEN
      GET STACKED DIAGNOSTICS v_sqlstate = RETURNED_SQLSTATE;
      IF v_sqlstate = '42501' THEN
        v_err_caught := true;
      END IF;
    END;
    IF NOT v_err_caught THEN
      RAISE EXCEPTION 'Modifying user_type in profiles did not raise 42501 (got SQLSTATE %)', v_sqlstate;
    END IF;

    UPDATE public.user_roles SET role = 'admin' WHERE user_id = v_user_a;
    GET DIAGNOSTICS v_count = ROW_COUNT;
    IF v_count <> 0 THEN
      RAISE EXCEPTION 'Non-admin caller updated user_roles directly (rows affected: %)', v_count;
    END IF;

    INSERT INTO test_results (test_name, passed, detail)
    VALUES ('Test 3: Privilege Escalation Protection', true, 'Modifying user_type raised SQLSTATE 42501; direct user_roles update affected 0 rows');
  EXCEPTION WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_sqlstate = RETURNED_SQLSTATE;
    INSERT INTO test_results (test_name, passed, detail)
    VALUES ('Test 3: Privilege Escalation Protection', false, 'SQLSTATE ' || v_sqlstate || ': ' || SQLERRM);
  END;

  -- ----------------------------------------------------------------------------
  -- TEST 4: Program catalog read-only active filtering
  -- ----------------------------------------------------------------------------
  BEGIN
    EXECUTE 'SET LOCAL ROLE authenticated';
    PERFORM set_config('request.jwt.claims', json_build_object('sub', v_user_a::text, 'role', 'authenticated')::text, true);

    SELECT count(*) INTO v_count FROM public.internship_programs;
    IF v_count <> 4 THEN
      RAISE EXCEPTION 'Expected 4 active programs visible to student, saw %', v_count;
    END IF;

    SELECT count(*) INTO v_count FROM public.internship_programs WHERE slug = 'python-fullstack';
    IF v_count <> 0 THEN
      RAISE EXCEPTION 'Inactive program python-fullstack visible to student without application!';
    END IF;

    v_err_caught := false;
    v_sqlstate := '';
    BEGIN
      INSERT INTO public.internship_programs (slug, title, vertical) VALUES ('hack-prog', 'Hack', 'IT');
    EXCEPTION WHEN OTHERS THEN
      GET STACKED DIAGNOSTICS v_sqlstate = RETURNED_SQLSTATE;
      IF v_sqlstate = '42501' THEN
        v_err_caught := true;
      END IF;
    END;
    IF NOT v_err_caught THEN
      RAISE EXCEPTION 'Student was able to INSERT into internship_programs (got SQLSTATE %)', v_sqlstate;
    END IF;

    INSERT INTO test_results (test_name, passed, detail)
    VALUES ('Test 4: Program Catalog Read-Only Filtering', true, 'Authenticated student can only view active programs; INSERT blocked with SQLSTATE ' || v_sqlstate);
  EXCEPTION WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_sqlstate = RETURNED_SQLSTATE;
    INSERT INTO test_results (test_name, passed, detail)
    VALUES ('Test 4: Program Catalog Read-Only Filtering', false, 'SQLSTATE ' || v_sqlstate || ': ' || SQLERRM);
  END;

  -- ----------------------------------------------------------------------------
  -- TEST 5: Student reading a deactivated program they applied to
  -- ----------------------------------------------------------------------------
  BEGIN
    -- Setup: Privileged insert of application for inactive program 'cyber-security' for Student A
    EXECUTE 'SET LOCAL ROLE postgres';
    PERFORM set_config('request.jwt.claims', '', true);

    INSERT INTO public.internship_applications (
      user_id, program_id, duration_months, price_inr_snapshot, status
    ) VALUES (
      v_user_a,
      (SELECT id FROM public.internship_programs WHERE slug = 'cyber-security'),
      1, 4999, 'submitted'
    );

    -- Switch to Student A
    EXECUTE 'SET LOCAL ROLE authenticated';
    PERFORM set_config('request.jwt.claims', json_build_object('sub', v_user_a::text, 'role', 'authenticated')::text, true);

    SELECT count(*) INTO v_count FROM public.internship_programs WHERE slug = 'cyber-security';
    IF v_count <> 1 THEN
      RAISE EXCEPTION 'Student A could not view deactivated program they applied to (count: %)', v_count;
    END IF;

    INSERT INTO test_results (test_name, passed, detail)
    VALUES ('Test 5: View Deactivated Program Applied To', true, 'Student A can view deactivated program cyber-security via applications EXISTS policy');
  EXCEPTION WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_sqlstate = RETURNED_SQLSTATE;
    INSERT INTO test_results (test_name, passed, detail)
    VALUES ('Test 5: View Deactivated Program Applied To', false, 'SQLSTATE ' || v_sqlstate || ': ' || SQLERRM);
  END;

  -- ----------------------------------------------------------------------------
  -- TEST 6: Student NOT reading a deactivated program they did not apply to
  -- ----------------------------------------------------------------------------
  BEGIN
    -- Switch to Student B (who did not apply to cyber-security)
    EXECUTE 'SET LOCAL ROLE authenticated';
    PERFORM set_config('request.jwt.claims', json_build_object('sub', v_user_b::text, 'role', 'authenticated')::text, true);

    SELECT count(*) INTO v_count FROM public.internship_programs WHERE slug = 'cyber-security';
    IF v_count <> 0 THEN
      RAISE EXCEPTION 'Student B was able to view deactivated program they did not apply to!';
    END IF;

    INSERT INTO test_results (test_name, passed, detail)
    VALUES ('Test 6: Deactivated Program Hidden From Non-Applicant', true, 'Student B cannot view deactivated program they did not apply to (returned 0 rows)');
  EXCEPTION WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_sqlstate = RETURNED_SQLSTATE;
    INSERT INTO test_results (test_name, passed, detail)
    VALUES ('Test 6: Deactivated Program Hidden From Non-Applicant', false, 'SQLSTATE ' || v_sqlstate || ': ' || SQLERRM);
  END;

  -- ----------------------------------------------------------------------------
  -- TEST 7: Direct INSERT into internship_applications blocked by RLS (expect 42501)
  -- ----------------------------------------------------------------------------
  BEGIN
    EXECUTE 'SET LOCAL ROLE authenticated';
    PERFORM set_config('request.jwt.claims', json_build_object('sub', v_user_a::text, 'role', 'authenticated')::text, true);

    v_err_caught := false;
    v_sqlstate := '';
    BEGIN
      INSERT INTO public.internship_applications (user_id, program_id, duration_months, price_inr_snapshot)
      VALUES (v_user_a, (SELECT id FROM public.internship_programs WHERE slug = 'java-fullstack'), 1, 0);
    EXCEPTION WHEN OTHERS THEN
      GET STACKED DIAGNOSTICS v_sqlstate = RETURNED_SQLSTATE;
      IF v_sqlstate = '42501' THEN
        v_err_caught := true;
      END IF;
    END;
    IF NOT v_err_caught THEN
      RAISE EXCEPTION 'Direct INSERT did not raise 42501 (got SQLSTATE %)', v_sqlstate;
    END IF;

    INSERT INTO test_results (test_name, passed, detail)
    VALUES ('Test 7: Direct Application Insert Blocked', true, 'Direct client INSERT into internship_applications blocked with SQLSTATE ' || v_sqlstate);
  EXCEPTION WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_sqlstate = RETURNED_SQLSTATE;
    INSERT INTO test_results (test_name, passed, detail)
    VALUES ('Test 7: Direct Application Insert Blocked', false, 'SQLSTATE ' || v_sqlstate || ': ' || SQLERRM);
  END;

  -- ----------------------------------------------------------------------------
  -- TEST 8: Direct UPDATE on internship_applications blocked (row count 0 or 42501)
  -- ----------------------------------------------------------------------------
  BEGIN
    EXECUTE 'SET LOCAL ROLE authenticated';
    PERFORM set_config('request.jwt.claims', json_build_object('sub', v_user_a::text, 'role', 'authenticated')::text, true);

    v_err_caught := false;
    v_sqlstate := '';
    v_count := 0;
    BEGIN
      UPDATE public.internship_applications SET status = 'approved' WHERE user_id = v_user_a;
      GET DIAGNOSTICS v_count = ROW_COUNT;
    EXCEPTION WHEN OTHERS THEN
      GET STACKED DIAGNOSTICS v_sqlstate = RETURNED_SQLSTATE;
      IF v_sqlstate = '42501' THEN
        v_err_caught := true;
      END IF;
    END;

    IF v_count > 0 THEN
      RAISE EXCEPTION 'Direct client UPDATE succeeded on internship_applications! (rows: %)', v_count;
    END IF;

    INSERT INTO test_results (test_name, passed, detail)
    VALUES ('Test 8: Direct Application Update Blocked', true, 'Direct UPDATE blocked (affected 0 rows, SQLSTATE: ' || COALESCE(NULLIF(v_sqlstate, ''), 'none') || ')');
  EXCEPTION WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_sqlstate = RETURNED_SQLSTATE;
    INSERT INTO test_results (test_name, passed, detail)
    VALUES ('Test 8: Direct Application Update Blocked', false, 'SQLSTATE ' || v_sqlstate || ': ' || SQLERRM);
  END;

  -- ----------------------------------------------------------------------------
  -- TEST 9: Authenticated role cannot execute generate_student_code() (expect 42501)
  -- ----------------------------------------------------------------------------
  BEGIN
    EXECUTE 'SET LOCAL ROLE authenticated';
    PERFORM set_config('request.jwt.claims', json_build_object('sub', v_user_a::text, 'role', 'authenticated')::text, true);

    v_err_caught := false;
    v_sqlstate := '';
    BEGIN
      PERFORM public.generate_student_code();
    EXCEPTION WHEN OTHERS THEN
      GET STACKED DIAGNOSTICS v_sqlstate = RETURNED_SQLSTATE;
      IF v_sqlstate = '42501' THEN
        v_err_caught := true;
      END IF;
    END;
    IF NOT v_err_caught THEN
      RAISE EXCEPTION 'Calling generate_student_code() did not raise 42501 (got SQLSTATE %)', v_sqlstate;
    END IF;

    INSERT INTO test_results (test_name, passed, detail)
    VALUES ('Test 9: Revoked Generator Execution', true, 'Calling generate_student_code() blocked with SQLSTATE ' || v_sqlstate);
  EXCEPTION WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_sqlstate = RETURNED_SQLSTATE;
    INSERT INTO test_results (test_name, passed, detail)
    VALUES ('Test 9: Revoked Generator Execution', false, 'SQLSTATE ' || v_sqlstate || ': ' || SQLERRM);
  END;

  -- ----------------------------------------------------------------------------
  -- TEST 10: Anonymous role cannot call submit_internship_application (expect 42501)
  -- ----------------------------------------------------------------------------
  BEGIN
    EXECUTE 'SET LOCAL ROLE anon';
    PERFORM set_config('request.jwt.claims', json_build_object('role', 'anon')::text, true);

    v_err_caught := false;
    v_sqlstate := '';
    BEGIN
      PERFORM public.submit_internship_application('java-fullstack', 1);
    EXCEPTION WHEN OTHERS THEN
      GET STACKED DIAGNOSTICS v_sqlstate = RETURNED_SQLSTATE;
      IF v_sqlstate = '42501' THEN
        v_err_caught := true;
      END IF;
    END;
    IF NOT v_err_caught THEN
      RAISE EXCEPTION 'Anonymous call did not raise 42501 (got SQLSTATE %)', v_sqlstate;
    END IF;

    INSERT INTO test_results (test_name, passed, detail)
    VALUES ('Test 10: Anonymous RPC Execution Blocked', true, 'Anonymous role execution blocked with SQLSTATE ' || v_sqlstate);
  EXCEPTION WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_sqlstate = RETURNED_SQLSTATE;
    INSERT INTO test_results (test_name, passed, detail)
    VALUES ('Test 10: Anonymous RPC Execution Blocked', false, 'SQLSTATE ' || v_sqlstate || ': ' || SQLERRM);
  END;

  -- ----------------------------------------------------------------------------
  -- TEST 11: Notification cross-tenant isolation and mark_read security
  -- ----------------------------------------------------------------------------
  BEGIN
    -- Setup fixture: notification for student B
    EXECUTE 'SET LOCAL ROLE postgres';
    PERFORM set_config('request.jwt.claims', '', true);

    INSERT INTO public.notifications (id, user_id, type, title, body)
    VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', v_user_b, 'test_b', 'Notification for B', 'Secret for B')
    ON CONFLICT (id) DO NOTHING;

    -- Switch to Student A
    EXECUTE 'SET LOCAL ROLE authenticated';
    PERFORM set_config('request.jwt.claims', json_build_object('sub', v_user_a::text, 'role', 'authenticated')::text, true);

    -- Student A tries to read Student B's notifications
    SELECT count(*) INTO v_count FROM public.notifications WHERE user_id = v_user_b;
    IF v_count <> 0 THEN
      RAISE EXCEPTION 'Student A was able to read Student B notification!';
    END IF;

    -- Student A attempts to mark Student B's notification as read
    PERFORM public.mark_notifications_read(ARRAY['bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid]);

    -- Verify Student B's notification remains unread
    EXECUTE 'SET LOCAL ROLE postgres';
    PERFORM set_config('request.jwt.claims', '', true);

    SELECT count(*) INTO v_count FROM public.notifications 
    WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb' AND read_at IS NULL;

    IF v_count <> 1 THEN
      RAISE EXCEPTION 'Student B notification was marked as read by Student A!';
    END IF;

    INSERT INTO test_results (test_name, passed, detail)
    VALUES ('Test 11: Notification Tenant Isolation', true, 'Student A cannot read Student B notifications; mark_notifications_read leaves other user rows unread');
  EXCEPTION WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_sqlstate = RETURNED_SQLSTATE;
    INSERT INTO test_results (test_name, passed, detail)
    VALUES ('Test 11: Notification Tenant Isolation', false, 'SQLSTATE ' || v_sqlstate || ': ' || SQLERRM);
  END;

  -- ----------------------------------------------------------------------------
  -- TEST 12: submit_internship_application fails if email not confirmed
  -- ----------------------------------------------------------------------------
  BEGIN
    EXECUTE 'SET LOCAL ROLE postgres';
    PERFORM set_config('request.jwt.claims', '', true);
    UPDATE auth.users SET email_confirmed_at = NULL WHERE id = v_user_a;

    EXECUTE 'SET LOCAL ROLE authenticated';
    PERFORM set_config('request.jwt.claims', json_build_object('sub', v_user_a::text, 'role', 'authenticated')::text, true);

    v_err_caught := false;
    v_sqlstate := '';
    BEGIN
      PERFORM public.submit_internship_application('java-fullstack', 1);
    EXCEPTION WHEN OTHERS THEN
      GET STACKED DIAGNOSTICS v_sqlstate = RETURNED_SQLSTATE;
      IF SQLERRM = 'email_not_verified' AND v_sqlstate = '42501' THEN
        v_err_caught := true;
      END IF;
    END;
    IF NOT v_err_caught THEN
      RAISE EXCEPTION 'Unconfirmed email did not raise email_not_verified / 42501 (got SQLSTATE %)', v_sqlstate;
    END IF;

    INSERT INTO test_results (test_name, passed, detail)
    VALUES ('Test 12: Email Confirmation Gate', true, 'Unconfirmed email raised email_not_verified with SQLSTATE ' || v_sqlstate);
  EXCEPTION WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_sqlstate = RETURNED_SQLSTATE;
    INSERT INTO test_results (test_name, passed, detail)
    VALUES ('Test 12: Email Confirmation Gate', false, 'SQLSTATE ' || v_sqlstate || ': ' || SQLERRM);
  END;

  -- ----------------------------------------------------------------------------
  -- TEST 13: submit_internship_application fails if profile incomplete
  -- ----------------------------------------------------------------------------
  BEGIN
    EXECUTE 'SET LOCAL ROLE postgres';
    PERFORM set_config('request.jwt.claims', '', true);
    UPDATE auth.users SET email_confirmed_at = now() WHERE id = v_user_a;
    UPDATE public.student_profiles SET college = NULL WHERE user_id = v_user_a;

    EXECUTE 'SET LOCAL ROLE authenticated';
    PERFORM set_config('request.jwt.claims', json_build_object('sub', v_user_a::text, 'role', 'authenticated')::text, true);

    v_err_caught := false;
    v_sqlstate := '';
    BEGIN
      PERFORM public.submit_internship_application('java-fullstack', 1);
    EXCEPTION WHEN OTHERS THEN
      GET STACKED DIAGNOSTICS v_sqlstate = RETURNED_SQLSTATE;
      IF SQLERRM = 'profile_incomplete' AND v_sqlstate = 'P0001' THEN
        v_err_caught := true;
      END IF;
    END;
    IF NOT v_err_caught THEN
      RAISE EXCEPTION 'Incomplete profile did not raise profile_incomplete / P0001 (got SQLSTATE %)', v_sqlstate;
    END IF;

    INSERT INTO test_results (test_name, passed, detail)
    VALUES ('Test 13: Profile Completion Gate', true, 'Incomplete education raised profile_incomplete with SQLSTATE ' || v_sqlstate);
  EXCEPTION WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_sqlstate = RETURNED_SQLSTATE;
    INSERT INTO test_results (test_name, passed, detail)
    VALUES ('Test 13: Profile Completion Gate', false, 'SQLSTATE ' || v_sqlstate || ': ' || SQLERRM);
  END;

  -- ----------------------------------------------------------------------------
  -- TEST 14: submit_internship_application fails on invalid_start_date
  -- ----------------------------------------------------------------------------
  BEGIN
    -- Restore profile
    EXECUTE 'SET LOCAL ROLE postgres';
    PERFORM set_config('request.jwt.claims', '', true);
    UPDATE public.student_profiles SET college = 'ABC Tech Institute' WHERE user_id = v_user_a;

    EXECUTE 'SET LOCAL ROLE authenticated';
    PERFORM set_config('request.jwt.claims', json_build_object('sub', v_user_a::text, 'role', 'authenticated')::text, true);

    -- Past date
    v_err_caught := false;
    v_sqlstate := '';
    BEGIN
      PERFORM public.submit_internship_application('java-fullstack', 1, CURRENT_DATE - 1);
    EXCEPTION WHEN OTHERS THEN
      GET STACKED DIAGNOSTICS v_sqlstate = RETURNED_SQLSTATE;
      IF SQLERRM = 'invalid_start_date' AND v_sqlstate = 'P0001' THEN
        v_err_caught := true;
      END IF;
    END;
    IF NOT v_err_caught THEN
      RAISE EXCEPTION 'Past start_preference did not raise invalid_start_date / P0001 (got SQLSTATE %)', v_sqlstate;
    END IF;

    -- Date beyond 90 days
    v_err_caught := false;
    v_sqlstate := '';
    BEGIN
      PERFORM public.submit_internship_application('java-fullstack', 1, CURRENT_DATE + 95);
    EXCEPTION WHEN OTHERS THEN
      GET STACKED DIAGNOSTICS v_sqlstate = RETURNED_SQLSTATE;
      IF SQLERRM = 'invalid_start_date' AND v_sqlstate = 'P0001' THEN
        v_err_caught := true;
      END IF;
    END;
    IF NOT v_err_caught THEN
      RAISE EXCEPTION 'Future date > 90 days did not raise invalid_start_date / P0001 (got SQLSTATE %)', v_sqlstate;
    END IF;

    INSERT INTO test_results (test_name, passed, detail)
    VALUES ('Test 14: Start Date Validation Gate', true, 'Past dates and dates > 90 days raised invalid_start_date with SQLSTATE ' || v_sqlstate);
  EXCEPTION WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_sqlstate = RETURNED_SQLSTATE;
    INSERT INTO test_results (test_name, passed, detail)
    VALUES ('Test 14: Start Date Validation Gate', false, 'SQLSTATE ' || v_sqlstate || ': ' || SQLERRM);
  END;

  -- ----------------------------------------------------------------------------
  -- TEST 15: submit_internship_application fails on statement_too_long
  -- ----------------------------------------------------------------------------
  BEGIN
    EXECUTE 'SET LOCAL ROLE authenticated';
    PERFORM set_config('request.jwt.claims', json_build_object('sub', v_user_a::text, 'role', 'authenticated')::text, true);

    v_err_caught := false;
    v_sqlstate := '';
    BEGIN
      PERFORM public.submit_internship_application('java-fullstack', 1, CURRENT_DATE + 7, repeat('A', 1501));
    EXCEPTION WHEN OTHERS THEN
      GET STACKED DIAGNOSTICS v_sqlstate = RETURNED_SQLSTATE;
      IF SQLERRM = 'statement_too_long' AND v_sqlstate = 'P0001' THEN
        v_err_caught := true;
      END IF;
    END;
    IF NOT v_err_caught THEN
      RAISE EXCEPTION 'Statement > 1500 chars did not raise statement_too_long / P0001 (got SQLSTATE %)', v_sqlstate;
    END IF;

    INSERT INTO test_results (test_name, passed, detail)
    VALUES ('Test 15: Statement Length Gate', true, 'Statements over 1500 chars raised statement_too_long with SQLSTATE ' || v_sqlstate);
  EXCEPTION WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_sqlstate = RETURNED_SQLSTATE;
    INSERT INTO test_results (test_name, passed, detail)
    VALUES ('Test 15: Statement Length Gate', false, 'SQLSTATE ' || v_sqlstate || ': ' || SQLERRM);
  END;

  -- ----------------------------------------------------------------------------
  -- TEST 16: submit_internship_application succeeds with valid inputs & DB price
  -- ----------------------------------------------------------------------------
  BEGIN
    EXECUTE 'SET LOCAL ROLE authenticated';
    PERFORM set_config('request.jwt.claims', json_build_object('sub', v_user_a::text, 'role', 'authenticated')::text, true);

    v_app := public.submit_internship_application('java-fullstack', 3, CURRENT_DATE + 14, 'Excited to learn.');

    IF v_app.price_inr_snapshot <> 14999 THEN
      RAISE EXCEPTION 'Expected price 14999, got %', v_app.price_inr_snapshot;
    END IF;
    IF v_app.status <> 'submitted' THEN
      RAISE EXCEPTION 'Expected status submitted, got %', v_app.status;
    END IF;
    IF v_app.application_code NOT LIKE 'APP-%' THEN
      RAISE EXCEPTION 'Invalid application code format: %', v_app.application_code;
    END IF;

    -- Verify notification contains program title (not slug)
    SELECT body INTO v_notif_body FROM public.notifications 
    WHERE user_id = v_user_a AND type = 'application_submitted'
    ORDER BY created_at DESC LIMIT 1;

    IF v_notif_body NOT LIKE '%Java Full Stack Developer%' THEN
      RAISE EXCEPTION 'Notification body did not use program title: %', v_notif_body;
    END IF;
    IF v_notif_body LIKE '%java-fullstack%' THEN
      RAISE EXCEPTION 'Notification body leaked slug: %', v_notif_body;
    END IF;

    INSERT INTO test_results (test_name, passed, detail)
    VALUES ('Test 16: Application Submission & Title Notification', true, 'Application created with DB price 14999; notification includes Java Full Stack Developer title');
  EXCEPTION WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_sqlstate = RETURNED_SQLSTATE;
    INSERT INTO test_results (test_name, passed, detail)
    VALUES ('Test 16: Application Submission & Title Notification', false, 'SQLSTATE ' || v_sqlstate || ': ' || SQLERRM);
  END;

  -- ----------------------------------------------------------------------------
  -- TEST 17: Duplicate active application blocked
  -- ----------------------------------------------------------------------------
  BEGIN
    EXECUTE 'SET LOCAL ROLE authenticated';
    PERFORM set_config('request.jwt.claims', json_build_object('sub', v_user_a::text, 'role', 'authenticated')::text, true);

    v_err_caught := false;
    v_sqlstate := '';
    BEGIN
      PERFORM public.submit_internship_application('java-fullstack', 1);
    EXCEPTION WHEN OTHERS THEN
      GET STACKED DIAGNOSTICS v_sqlstate = RETURNED_SQLSTATE;
      IF SQLERRM = 'duplicate_application' AND v_sqlstate = '23505' THEN
        v_err_caught := true;
      END IF;
    END;
    IF NOT v_err_caught THEN
      RAISE EXCEPTION 'Duplicate application did not raise duplicate_application / 23505 (got SQLSTATE %)', v_sqlstate;
    END IF;

    INSERT INTO test_results (test_name, passed, detail)
    VALUES ('Test 17: Duplicate Active Application Blocked', true, 'Duplicate active submission blocked with SQLSTATE ' || v_sqlstate);
  EXCEPTION WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_sqlstate = RETURNED_SQLSTATE;
    INSERT INTO test_results (test_name, passed, detail)
    VALUES ('Test 17: Duplicate Active Application Blocked', false, 'SQLSTATE ' || v_sqlstate || ': ' || SQLERRM);
  END;

  -- ----------------------------------------------------------------------------
  -- TEST 18: cancel_internship_application transitions status and includes title
  -- ----------------------------------------------------------------------------
  BEGIN
    -- Non-owner cancel attempt
    EXECUTE 'SET LOCAL ROLE authenticated';
    PERFORM set_config('request.jwt.claims', json_build_object('sub', v_user_b::text, 'role', 'authenticated')::text, true);

    v_err_caught := false;
    v_sqlstate := '';
    BEGIN
      PERFORM public.cancel_internship_application(v_app.id);
    EXCEPTION WHEN OTHERS THEN
      GET STACKED DIAGNOSTICS v_sqlstate = RETURNED_SQLSTATE;
      IF v_sqlstate = 'P0005' THEN
        v_err_caught := true;
      END IF;
    END;
    IF NOT v_err_caught THEN
      RAISE EXCEPTION 'Non-owner cancel did not raise P0005 (got SQLSTATE %)', v_sqlstate;
    END IF;

    -- Owner cancel
    EXECUTE 'SET LOCAL ROLE authenticated';
    PERFORM set_config('request.jwt.claims', json_build_object('sub', v_user_a::text, 'role', 'authenticated')::text, true);

    v_cancelled_app := public.cancel_internship_application(v_app.id);
    IF v_cancelled_app.status <> 'cancelled' THEN
      RAISE EXCEPTION 'Expected cancelled status, got %', v_cancelled_app.status;
    END IF;

    -- Verify cancellation notification body includes program title
    SELECT body INTO v_notif_body FROM public.notifications 
    WHERE user_id = v_user_a AND type = 'application_cancelled'
    ORDER BY created_at DESC LIMIT 1;

    IF v_notif_body NOT LIKE '%Java Full Stack Developer%' THEN
      RAISE EXCEPTION 'Cancellation notification body missing program title: %', v_notif_body;
    END IF;

    -- Second cancel attempt should fail
    v_err_caught := false;
    v_sqlstate := '';
    BEGIN
      PERFORM public.cancel_internship_application(v_app.id);
    EXCEPTION WHEN OTHERS THEN
      GET STACKED DIAGNOSTICS v_sqlstate = RETURNED_SQLSTATE;
      IF v_sqlstate = 'P0005' THEN
        v_err_caught := true;
      END IF;
    END;
    IF NOT v_err_caught THEN
      RAISE EXCEPTION 'Re-cancelling application did not raise P0005 (got SQLSTATE %)', v_sqlstate;
    END IF;

    INSERT INTO test_results (test_name, passed, detail)
    VALUES ('Test 18: Application Cancellation Lifecycle', true, 'Application cancelled; notification includes program title; non-owner and re-cancel blocked with SQLSTATE P0005');
  EXCEPTION WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_sqlstate = RETURNED_SQLSTATE;
    INSERT INTO test_results (test_name, passed, detail)
    VALUES ('Test 18: Application Cancellation Lifecycle', false, 'SQLSTATE ' || v_sqlstate || ': ' || SQLERRM);
  END;

  -- ----------------------------------------------------------------------------
  -- TEST 19: Storage prefix tenant isolation (expect 42501)
  -- ----------------------------------------------------------------------------
  BEGIN
    EXECUTE 'SET LOCAL ROLE authenticated';
    PERFORM set_config('request.jwt.claims', json_build_object('sub', v_user_a::text, 'role', 'authenticated')::text, true);

    v_err_caught := false;
    v_sqlstate := '';
    BEGIN
      INSERT INTO storage.objects (bucket_id, name, owner)
      VALUES ('student-resumes', v_user_b::text || '/resume.pdf', v_user_a);
    EXCEPTION WHEN OTHERS THEN
      GET STACKED DIAGNOSTICS v_sqlstate = RETURNED_SQLSTATE;
      IF v_sqlstate = '42501' THEN
        v_err_caught := true;
      END IF;
    END;
    IF NOT v_err_caught THEN
      RAISE EXCEPTION 'Cross-folder storage upload did not raise 42501 (got SQLSTATE %)', v_sqlstate;
    END IF;

    INSERT INTO test_results (test_name, passed, detail)
    VALUES ('Test 19: Storage Prefix Tenant Isolation', true, 'Uploading outside user {uid}/ prefix blocked with SQLSTATE ' || v_sqlstate);
  EXCEPTION WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_sqlstate = RETURNED_SQLSTATE;
    INSERT INTO test_results (test_name, passed, detail)
    VALUES ('Test 19: Storage Prefix Tenant Isolation', false, 'SQLSTATE ' || v_sqlstate || ': ' || SQLERRM);
  END;

END;
$$;

-- Render test outcomes as rows for the SQL editor
SELECT test_name, passed, detail FROM test_results ORDER BY id;

-- Automatically rollback to leave zero traces in the database
ROLLBACK;
