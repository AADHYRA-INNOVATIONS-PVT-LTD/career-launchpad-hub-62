-- ==============================================================================
-- Post-Apply Verification Suite: Phase 1 Schema, Permissions & Policies
-- File: supabase/tests/phase1_post_apply_checks.sql
-- Description: Read-only verification queries to execute after applying the
--              Phase 1 migration on a database. Contains SELECT queries only.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- CHECK A: Verify Row Level Security (RLS) is enabled for all 5 Phase 1 tables
-- Expected: rls_enabled = true for all 5 tables.
-- ------------------------------------------------------------------------------
SELECT 
    c.relname AS table_name,
    c.relrowsecurity AS rls_enabled,
    c.relforcerowsecurity AS rls_forced
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relname IN (
    'student_profiles',
    'internship_programs',
    'internship_durations',
    'internship_applications',
    'notifications'
  )
ORDER BY c.relname;

-- ------------------------------------------------------------------------------
-- CHECK B: Verify EXECUTE privileges on all Phase 1 functions (anon vs authenticated)
-- Expected:
--   - Internal triggers/generators: anon = false, authenticated = false
--   - Public client RPCs (ensure_student_profile, submit_internship_application,
--     cancel_internship_application, mark_notifications_read):
--     anon = false, authenticated = true
-- ------------------------------------------------------------------------------
SELECT 
    p.proname AS function_name,
    pg_get_function_identity_arguments(p.oid) AS arguments,
    has_function_privilege('anon', p.oid, 'EXECUTE') AS anon_can_execute,
    has_function_privilege('authenticated', p.oid, 'EXECUTE') AS authenticated_can_execute
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public'
  AND p.proname IN (
    'generate_student_code',
    'generate_application_code',
    'sync_student_education_completed',
    'protect_student_profile_immutability',
    'protect_profile_privilege',
    'handle_new_user',
    'ensure_student_profile',
    'submit_internship_application',
    'cancel_internship_application',
    'mark_notifications_read'
  )
ORDER BY p.proname;

-- ------------------------------------------------------------------------------
-- CHECK C: Inspect all RLS policies on the 5 Phase 1 tables & storage.objects
-- Expected:
--   - internship_applications: SELECT (own/admin), UPDATE (admin only).
--     NO INSERT or DELETE policy for authenticated.
--   - notifications: SELECT (own). NO INSERT/UPDATE/DELETE for authenticated.
--   - internship_programs: SELECT (active / applied-to / admin ALL).
--     NO client INSERT/UPDATE/DELETE.
--   - internship_durations: SELECT (active / admin ALL).
--     NO client INSERT/UPDATE/DELETE.
--   - student_profiles: SELECT (own/admin), UPDATE (own).
--   - storage.objects: student-resumes & student-avatars prefix-isolated policies.
-- ------------------------------------------------------------------------------
SELECT 
    schemaname,
    tablename,
    policyname,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE (
    schemaname = 'public' AND tablename IN (
      'student_profiles',
      'internship_programs',
      'internship_durations',
      'internship_applications',
      'notifications'
    )
) OR (
    schemaname = 'storage' AND tablename = 'objects' AND (
      policyname ILIKE '%student resume%' OR 
      policyname ILIKE '%student avatar%'
    )
)
ORDER BY schemaname, tablename, cmd, policyname;
