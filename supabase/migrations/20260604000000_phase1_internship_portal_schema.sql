-- ==============================================================================
-- Migration: 20260604000000_phase1_internship_portal_schema.sql
-- Description: Phase 1 — Student Authentication, Student Profiles, IT Internship
--              Programs, Pricing Durations, Applications, Notifications & Storage.
-- Idempotent & Additive: Uses IF NOT EXISTS, CREATE OR REPLACE, DROP POLICY IF EXISTS.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. SEQUENCES & CODE GENERATORS
-- ------------------------------------------------------------------------------

CREATE SEQUENCE IF NOT EXISTS public.student_code_seq START 1;
CREATE SEQUENCE IF NOT EXISTS public.application_code_seq START 1;

CREATE OR REPLACE FUNCTION public.generate_student_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  RETURN 'AAD-' || to_char(CURRENT_DATE, 'YYYY') || '-' || lpad(nextval('public.student_code_seq')::text, 6, '0');
END;
$$;
COMMENT ON FUNCTION public.generate_student_code() IS 'Generates unique sequential student code AAD-YYYY-NNNNNN.';

CREATE OR REPLACE FUNCTION public.generate_application_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  RETURN 'APP-' || to_char(CURRENT_DATE, 'YYYY') || '-' || lpad(nextval('public.application_code_seq')::text, 6, '0');
END;
$$;
COMMENT ON FUNCTION public.generate_application_code() IS 'Generates unique sequential application code APP-YYYY-NNNNNN.';

-- ------------------------------------------------------------------------------
-- 2. STUDENT PROFILES TABLE & TRIGGERS
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.student_profiles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    student_code TEXT NOT NULL UNIQUE DEFAULT public.generate_student_code(),
    college TEXT,
    degree TEXT,
    branch TEXT,
    academic_year SMALLINT CHECK (academic_year BETWEEN 1 AND 6),
    graduation_year SMALLINT,
    skills TEXT[] DEFAULT '{}'::text[] CHECK (cardinality(skills) <= 30),
    resume_path TEXT,
    education_completed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT student_profiles_resume_path_owner CHECK (resume_path IS NULL OR resume_path LIKE user_id::text || '/%')
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'student_profiles_resume_path_owner'
      AND conrelid = 'public.student_profiles'::regclass
  ) THEN
    ALTER TABLE public.student_profiles
      ADD CONSTRAINT student_profiles_resume_path_owner
      CHECK (resume_path IS NULL OR resume_path LIKE user_id::text || '/%');
  END IF;
END;
$$;

ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;

-- Synchronize education_completed flag
CREATE OR REPLACE FUNCTION public.sync_student_education_completed()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.education_completed := (
    NEW.college IS NOT NULL AND length(trim(NEW.college)) > 0 AND
    NEW.degree IS NOT NULL AND length(trim(NEW.degree)) > 0 AND
    NEW.academic_year IS NOT NULL
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_student_education_completed ON public.student_profiles;
CREATE TRIGGER trg_sync_student_education_completed
  BEFORE INSERT OR UPDATE ON public.student_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_student_education_completed();

-- Protect immutable fields (user_id and student_code) for non-admin callers
CREATE OR REPLACE FUNCTION public.protect_student_profile_immutability()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF auth.uid() IS NOT NULL AND NOT public.is_admin() THEN
    IF NEW.user_id IS DISTINCT FROM OLD.user_id THEN
      RAISE EXCEPTION 'Cannot modify immutable user_id in student_profiles'
        USING ERRCODE = '42501';
    END IF;
    IF NEW.student_code IS DISTINCT FROM OLD.student_code THEN
      RAISE EXCEPTION 'Cannot modify immutable student_code in student_profiles'
        USING ERRCODE = '42501';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_student_profile_immutability ON public.student_profiles;
CREATE TRIGGER trg_protect_student_profile_immutability
  BEFORE UPDATE ON public.student_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_student_profile_immutability();

-- Updated_at trigger
DROP TRIGGER IF EXISTS update_student_profiles_updated_at ON public.student_profiles;
CREATE TRIGGER update_student_profiles_updated_at
  BEFORE UPDATE ON public.student_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- student_profiles RLS Policies
DROP POLICY IF EXISTS "Students can view own profile or admin" ON public.student_profiles;
CREATE POLICY "Students can view own profile or admin"
  ON public.student_profiles FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Students can update own profile" ON public.student_profiles;
CREATE POLICY "Students can update own profile"
  ON public.student_profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 3. PROFILES PRIVILEGE PROTECTION TRIGGER
-- ------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.protect_profile_privilege()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- When caller is an authenticated non-admin, block any change to user_type
  IF auth.uid() IS NOT NULL AND NOT public.is_admin() THEN
    IF NEW.user_type IS DISTINCT FROM OLD.user_type THEN
      RAISE EXCEPTION 'Non-admin users cannot change user_type in profiles'
        USING ERRCODE = '42501';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_profile_privilege ON public.profiles;
CREATE TRIGGER trg_protect_profile_privilege
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_profile_privilege();

-- ------------------------------------------------------------------------------
-- 4. SAFE USER INITIALIZATION TRIGGER & RPC
-- ------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_mobile TEXT;
  v_raw_mobile TEXT;
BEGIN
  -- Validate Indian mobile format: ^\+91[6-9][0-9]{9}$
  v_raw_mobile := trim(COALESCE(NEW.raw_user_meta_data->>'mobile', ''));
  IF v_raw_mobile ~ '^\+91[6-9][0-9]{9}$' THEN
    v_mobile := v_raw_mobile;
  ELSE
    v_mobile := NULL;
  END IF;

  -- 1. Insert into public.profiles
  INSERT INTO public.profiles (user_id, full_name, mobile)
  VALUES (
    NEW.id,
    COALESCE(NULLIF(trim(NEW.raw_user_meta_data->>'full_name'), ''), NEW.email),
    v_mobile
  )
  ON CONFLICT (user_id) DO NOTHING;

  -- 2. Insert into public.user_roles (always 'student', ignores any role in metadata)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student')
  ON CONFLICT (user_id, role) DO NOTHING;

  -- 3. Nested block: initialize student_profiles safely (failure never blocks signup)
  BEGIN
    INSERT INTO public.student_profiles (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'handle_new_user: Failed to initialize student_profile for user %: %', NEW.id, SQLERRM;
  END;

  RETURN NEW;
END;
$$;

-- Ensure student profile RPC (authenticated callers)
CREATE OR REPLACE FUNCTION public.ensure_student_profile()
RETURNS public.student_profiles
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_uid UUID;
  v_profile public.student_profiles;
BEGIN
  v_uid := auth.uid();
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501';
  END IF;

  INSERT INTO public.student_profiles (user_id)
  VALUES (v_uid)
  ON CONFLICT (user_id) DO NOTHING;

  SELECT * INTO v_profile
  FROM public.student_profiles
  WHERE user_id = v_uid;

  RETURN v_profile;
END;
$$;
COMMENT ON FUNCTION public.ensure_student_profile() IS 'Ensures student_profiles record exists for the calling authenticated user and returns it.';

-- ------------------------------------------------------------------------------
-- 5. INTERNSHIP PROGRAMS & DURATIONS
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.internship_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    vertical TEXT NOT NULL CHECK (vertical IN ('IT', 'NON_IT')),
    mode TEXT NOT NULL DEFAULT 'online',
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 0
);

ALTER TABLE public.internship_programs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view active internship programs" ON public.internship_programs;
CREATE POLICY "Anyone can view active internship programs"
  ON public.internship_programs FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage all internship programs" ON public.internship_programs;
CREATE POLICY "Admins can manage all internship programs"
  ON public.internship_programs FOR ALL
  USING (public.is_admin());

CREATE TABLE IF NOT EXISTS public.internship_durations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vertical TEXT NOT NULL CHECK (vertical IN ('IT', 'NON_IT')),
    months SMALLINT NOT NULL CHECK (months BETWEEN 1 AND 12),
    price_inr INTEGER NOT NULL CHECK (price_inr >= 0),
    is_active BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT unique_vertical_months UNIQUE (vertical, months)
);

ALTER TABLE public.internship_durations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view active internship durations" ON public.internship_durations;
CREATE POLICY "Anyone can view active internship durations"
  ON public.internship_durations FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage all internship durations" ON public.internship_durations;
CREATE POLICY "Admins can manage all internship durations"
  ON public.internship_durations FOR ALL
  USING (public.is_admin());

-- Seed Approved IT Programs (active & inactive per specification)
INSERT INTO public.internship_programs (slug, title, vertical, mode, description, is_active, sort_order) VALUES
('java-fullstack', 'Java Full Stack Developer', 'IT', 'online', NULL, true, 1),
('ai-ml', 'AI & Machine Learning Engineer', 'IT', 'online', NULL, true, 2),
('data-analytics', 'Data Analytics & BI Specialist', 'IT', 'online', NULL, true, 3),
('aws-cloud', 'Cloud Computing & DevOps (AWS)', 'IT', 'online', NULL, true, 4),
('python-fullstack', 'Python Full Stack Developer', 'IT', 'online', NULL, false, 5),
('data-science', 'Data Science Specialist', 'IT', 'online', NULL, false, 6),
('cyber-security', 'Cyber Security Specialist', 'IT', 'online', NULL, false, 7)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  vertical = EXCLUDED.vertical,
  mode = EXCLUDED.mode,
  description = EXCLUDED.description,
  is_active = EXCLUDED.is_active,
  sort_order = EXCLUDED.sort_order;

-- Seed Locked IT Duration Prices
INSERT INTO public.internship_durations (vertical, months, price_inr, is_active) VALUES
('IT', 1, 4999, true),
('IT', 2, 9999, true),
('IT', 3, 14999, true),
('IT', 4, 19999, true),
('IT', 5, 24999, true),
('IT', 6, 24999, true)
ON CONFLICT (vertical, months) DO UPDATE SET
  price_inr = EXCLUDED.price_inr,
  is_active = EXCLUDED.is_active;

-- ------------------------------------------------------------------------------
-- 6. NOTIFICATIONS TABLE & RPC
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    link TEXT,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_notifications_user_created 
  ON public.notifications (user_id, created_at DESC);

DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.mark_notifications_read(p_ids UUID[] DEFAULT NULL)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_uid UUID;
BEGIN
  v_uid := auth.uid();
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501';
  END IF;

  IF p_ids IS NULL OR cardinality(p_ids) = 0 THEN
    UPDATE public.notifications
    SET read_at = now()
    WHERE user_id = v_uid AND read_at IS NULL;
  ELSE
    UPDATE public.notifications
    SET read_at = now()
    WHERE user_id = v_uid AND id = ANY(p_ids) AND read_at IS NULL;
  END IF;
END;
$$;
COMMENT ON FUNCTION public.mark_notifications_read(UUID[]) IS 'Marks caller notifications as read.';

-- ------------------------------------------------------------------------------
-- 7. INTERNSHIP APPLICATIONS TABLE & RPCS
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.internship_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_code TEXT UNIQUE NOT NULL DEFAULT public.generate_application_code(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    program_id UUID NOT NULL REFERENCES public.internship_programs(id),
    duration_months SMALLINT NOT NULL,
    price_inr_snapshot INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'INR',
    mode TEXT NOT NULL DEFAULT 'online',
    status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'approved', 'rejected', 'payment_pending', 'paid', 'enrolled', 'cancelled')),
    start_preference DATE,
    statement TEXT CHECK (statement IS NULL OR length(statement) <= 1500),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.internship_applications ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_internship_apps_user_created
  ON public.internship_applications (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_internship_apps_program
  ON public.internship_applications (program_id);

CREATE INDEX IF NOT EXISTS idx_internship_apps_status
  ON public.internship_applications (status);

-- Partial unique index blocking duplicate active applications for the same program
CREATE UNIQUE INDEX IF NOT EXISTS idx_internship_apps_unique_active
  ON public.internship_applications (user_id, program_id)
  WHERE status IN ('submitted', 'under_review', 'approved', 'payment_pending');

DROP TRIGGER IF EXISTS update_internship_applications_updated_at ON public.internship_applications;
CREATE TRIGGER update_internship_applications_updated_at
  BEFORE UPDATE ON public.internship_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- RLS: SELECT own or admin. No client INSERT, UPDATE, or DELETE policies.
DROP POLICY IF EXISTS "Users can view own applications or admin" ON public.internship_applications;
CREATE POLICY "Users can view own applications or admin"
  ON public.internship_applications FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Admins can update applications" ON public.internship_applications;
CREATE POLICY "Admins can update applications"
  ON public.internship_applications FOR UPDATE
  USING (public.is_admin());

-- Allow authenticated users to view programs they have applied to even if deactivated
DROP POLICY IF EXISTS "Users can view programs they applied to"
  ON public.internship_programs;
CREATE POLICY "Users can view programs they applied to"
  ON public.internship_programs FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.internship_applications a
    WHERE a.program_id = internship_programs.id
      AND a.user_id = auth.uid()));

-- RPC: submit_internship_application
CREATE OR REPLACE FUNCTION public.submit_internship_application(
  p_program_slug TEXT,
  p_months INTEGER,
  p_start_preference DATE DEFAULT NULL,
  p_statement TEXT DEFAULT NULL
)
RETURNS public.internship_applications
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_uid UUID;
  v_email_confirmed_at TIMESTAMPTZ;
  v_edu_completed BOOLEAN;
  v_program_id UUID;
  v_title TEXT;
  v_vertical TEXT;
  v_price INTEGER;
  v_recent_count INTEGER;
  v_app public.internship_applications;
BEGIN
  -- 1. Authentication check
  v_uid := auth.uid();
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501';
  END IF;

  -- 2. Server-side input validation
  IF p_start_preference IS NOT NULL AND (p_start_preference < CURRENT_DATE OR p_start_preference > CURRENT_DATE + 90) THEN
    RAISE EXCEPTION 'invalid_start_date' USING ERRCODE = 'P0001';
  END IF;

  IF p_statement IS NOT NULL AND length(p_statement) > 1500 THEN
    RAISE EXCEPTION 'statement_too_long' USING ERRCODE = 'P0001';
  END IF;

  -- 3. Email verification check
  SELECT email_confirmed_at INTO v_email_confirmed_at
  FROM auth.users
  WHERE id = v_uid;

  IF v_email_confirmed_at IS NULL THEN
    RAISE EXCEPTION 'email_not_verified' USING ERRCODE = '42501';
  END IF;

  -- 4. Profile completion check
  SELECT education_completed INTO v_edu_completed
  FROM public.student_profiles
  WHERE user_id = v_uid;

  IF v_edu_completed IS NOT TRUE THEN
    RAISE EXCEPTION 'profile_incomplete' USING ERRCODE = 'P0001';
  END IF;

  -- 5. Program lookup
  SELECT id, title, vertical INTO v_program_id, v_title, v_vertical
  FROM public.internship_programs
  WHERE slug = p_program_slug AND is_active = true;

  IF v_program_id IS NULL THEN
    RAISE EXCEPTION 'program_not_found' USING ERRCODE = 'P0002';
  END IF;

  -- 6. Duration & Price lookup from database (never from client)
  SELECT price_inr INTO v_price
  FROM public.internship_durations
  WHERE vertical = v_vertical AND months = p_months AND is_active = true;

  IF v_price IS NULL THEN
    RAISE EXCEPTION 'duration_not_found' USING ERRCODE = 'P0003';
  END IF;

  -- 7. Duplicate active application check
  IF EXISTS (
    SELECT 1 FROM public.internship_applications
    WHERE user_id = v_uid
      AND program_id = v_program_id
      AND status IN ('submitted', 'under_review', 'approved', 'payment_pending')
  ) THEN
    RAISE EXCEPTION 'duplicate_application' USING ERRCODE = '23505';
  END IF;

  -- 8. Rate limiting: max 10 submissions per user per 24 hours
  SELECT count(*) INTO v_recent_count
  FROM public.internship_applications
  WHERE user_id = v_uid AND created_at >= (now() - interval '24 hours');

  IF v_recent_count >= 10 THEN
    RAISE EXCEPTION 'rate_limited' USING ERRCODE = 'P0004';
  END IF;

  -- 9. Insert application (race-safe against concurrent submissions)
  BEGIN
    INSERT INTO public.internship_applications (
      user_id,
      program_id,
      duration_months,
      price_inr_snapshot,
      currency,
      mode,
      status,
      start_preference,
      statement
    )
    VALUES (
      v_uid,
      v_program_id,
      p_months::smallint,
      v_price,
      'INR',
      'online',
      'submitted',
      p_start_preference,
      NULLIF(trim(p_statement), '')
    )
    RETURNING * INTO v_app;
  EXCEPTION WHEN unique_violation THEN
    RAISE EXCEPTION 'duplicate_application' USING ERRCODE = '23505';
  END;

  -- 10. Notification dispatch for caller
  INSERT INTO public.notifications (
    user_id,
    type,
    title,
    body,
    link
  )
  VALUES (
    v_uid,
    'application_submitted',
    'Application Submitted',
    'Your application ' || v_app.application_code || ' for ' || v_title || ' (' || p_months || ' months) has been received.',
    '/dashboard/applications'
  );

  RETURN v_app;
END;
$$;
COMMENT ON FUNCTION public.submit_internship_application(TEXT, INTEGER, DATE, TEXT) IS 'Validates user profile, verifies email, fetches DB pricing, creates internship application, and sends notification.';

-- RPC: cancel_internship_application
CREATE OR REPLACE FUNCTION public.cancel_internship_application(p_application_id UUID)
RETURNS public.internship_applications
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_uid UUID;
  v_title TEXT;
  v_app public.internship_applications;
BEGIN
  v_uid := auth.uid();
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501';
  END IF;

  -- Update only if caller is owner and status is 'submitted'
  UPDATE public.internship_applications
  SET status = 'cancelled',
      updated_at = now()
  WHERE id = p_application_id
    AND user_id = v_uid
    AND status = 'submitted'
  RETURNING * INTO v_app;

  IF v_app.id IS NULL THEN
    RAISE EXCEPTION 'cannot_cancel_application' USING ERRCODE = 'P0005';
  END IF;

  -- Fetch program title for user notification
  SELECT p.title INTO v_title
  FROM public.internship_programs p
  WHERE p.id = v_app.program_id;

  -- Notification dispatch for cancellation
  INSERT INTO public.notifications (
    user_id,
    type,
    title,
    body,
    link
  )
  VALUES (
    v_uid,
    'application_cancelled',
    'Application Cancelled',
    'Your application ' || v_app.application_code || ' for ' || COALESCE(v_title, 'Internship Program') || ' has been cancelled.',
    '/dashboard/applications'
  );

  RETURN v_app;
END;
$$;
COMMENT ON FUNCTION public.cancel_internship_application(UUID) IS 'Cancels a submitted application for the owner and sends notification.';

-- ------------------------------------------------------------------------------
-- 8. STORAGE BUCKETS & POLICIES
-- ------------------------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('student-resumes', 'student-resumes', false, 5242880, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
  ('student-avatars', 'student-avatars', false, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage policies (path format: {uid}/<filename>)
DROP POLICY IF EXISTS "Users can upload own student resumes" ON storage.objects;
CREATE POLICY "Users can upload own student resumes"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'student-resumes' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Users can read own student resumes or admin" ON storage.objects;
CREATE POLICY "Users can read own student resumes or admin"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'student-resumes' AND
    ((storage.foldername(name))[1] = auth.uid()::text OR public.is_admin())
  );

DROP POLICY IF EXISTS "Users can update own student resumes" ON storage.objects;
CREATE POLICY "Users can update own student resumes"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'student-resumes' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Users can delete own student resumes" ON storage.objects;
CREATE POLICY "Users can delete own student resumes"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'student-resumes' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Users can upload own student avatars" ON storage.objects;
CREATE POLICY "Users can upload own student avatars"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'student-avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Users can read own student avatars or admin" ON storage.objects;
CREATE POLICY "Users can read own student avatars or admin"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'student-avatars' AND
    ((storage.foldername(name))[1] = auth.uid()::text OR public.is_admin())
  );

DROP POLICY IF EXISTS "Users can update own student avatars" ON storage.objects;
CREATE POLICY "Users can update own student avatars"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'student-avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Users can delete own student avatars" ON storage.objects;
CREATE POLICY "Users can delete own student avatars"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'student-avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- ------------------------------------------------------------------------------
-- 9. PERMISSION REVOCATION & GRANTS
-- ------------------------------------------------------------------------------

-- NOTE FOR OWNER: After applying this migration, run the signup smoke test to
-- confirm that column defaults (generate_student_code(), generate_application_code())
-- and triggers continue to execute seamlessly under SECURITY DEFINER / table owner
-- privileges even though direct EXECUTE has been revoked from client roles.

REVOKE EXECUTE ON FUNCTION public.generate_student_code() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.generate_application_code() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.sync_student_education_completed() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.protect_student_profile_immutability() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.protect_profile_privilege() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.ensure_student_profile() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.ensure_student_profile() TO authenticated;

REVOKE EXECUTE ON FUNCTION public.submit_internship_application(TEXT, INTEGER, DATE, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.submit_internship_application(TEXT, INTEGER, DATE, TEXT) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.cancel_internship_application(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.cancel_internship_application(UUID) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.mark_notifications_read(UUID[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.mark_notifications_read(UUID[]) TO authenticated;

-- ==============================================================================
-- 10. DOCUMENTATION, MANUAL BOOTSTRAP & ROLLBACK SPECIFICATION
-- ==============================================================================

/*
--------------------------------------------------------------------------------
MANUAL FIRST-ADMIN BOOTSTRAP:
To promote an initial user to administrator, execute the following SQL in the
Supabase SQL Editor using the user's UUID from auth.users:

  INSERT INTO public.user_roles (user_id, role)
  VALUES ('<USER_UUID_FROM_AUTH_USERS>', 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;

--------------------------------------------------------------------------------
OPTIONAL BACKFILL STATEMENT FOR EXISTING LEGACY STUDENTS:
To initialize student_profiles for existing users who already possess the 'student' role:

  INSERT INTO public.student_profiles (user_id)
  SELECT ur.user_id
  FROM public.user_roles ur
  WHERE ur.role = 'student'
  ON CONFLICT (user_id) DO NOTHING;

--------------------------------------------------------------------------------
IDEMPOTENT ROLLBACK SCRIPT (Execute in reverse dependency order if required):

  DROP POLICY IF EXISTS "Users can delete own student avatars" ON storage.objects;
  DROP POLICY IF EXISTS "Users can update own student avatars" ON storage.objects;
  DROP POLICY IF EXISTS "Users can read own student avatars or admin" ON storage.objects;
  DROP POLICY IF EXISTS "Users can upload own student avatars" ON storage.objects;
  DROP POLICY IF EXISTS "Users can delete own student resumes" ON storage.objects;
  DROP POLICY IF EXISTS "Users can update own student resumes" ON storage.objects;
  DROP POLICY IF EXISTS "Users can read own student resumes or admin" ON storage.objects;
  DROP POLICY IF EXISTS "Users can upload own student resumes" ON storage.objects;
  DELETE FROM storage.buckets WHERE id IN ('student-resumes', 'student-avatars');

  DROP FUNCTION IF EXISTS public.cancel_internship_application(UUID);
  DROP FUNCTION IF EXISTS public.submit_internship_application(TEXT, INTEGER, DATE, TEXT);
  DROP POLICY IF EXISTS "Admins can update applications" ON public.internship_applications;
  DROP POLICY IF EXISTS "Users can view own applications or admin" ON public.internship_applications;
  DROP TRIGGER IF EXISTS update_internship_applications_updated_at ON public.internship_applications;
  DROP TABLE IF EXISTS public.internship_applications;

  DROP FUNCTION IF EXISTS public.mark_notifications_read(UUID[]);
  DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
  DROP TABLE IF EXISTS public.notifications;

  DROP POLICY IF EXISTS "Admins can manage all internship durations" ON public.internship_durations;
  DROP POLICY IF EXISTS "Anyone can view active internship durations" ON public.internship_durations;
  DROP TABLE IF EXISTS public.internship_durations;

  DROP POLICY IF EXISTS "Users can view programs they applied to" ON public.internship_programs;
  DROP POLICY IF EXISTS "Admins can manage all internship programs" ON public.internship_programs;
  DROP POLICY IF EXISTS "Anyone can view active internship programs" ON public.internship_programs;
  DROP TABLE IF EXISTS public.internship_programs;

  DROP FUNCTION IF EXISTS public.ensure_student_profile();
  DROP TRIGGER IF EXISTS trg_protect_profile_privilege ON public.profiles;
  DROP FUNCTION IF EXISTS public.protect_profile_privilege();

  DROP POLICY IF EXISTS "Students can update own profile" ON public.student_profiles;
  DROP POLICY IF EXISTS "Students can view own profile or admin" ON public.student_profiles;
  DROP TRIGGER IF EXISTS update_student_profiles_updated_at ON public.student_profiles;
  DROP TRIGGER IF EXISTS trg_protect_student_profile_immutability ON public.student_profiles;
  DROP FUNCTION IF EXISTS public.protect_student_profile_immutability();
  DROP TRIGGER IF EXISTS trg_sync_student_education_completed ON public.student_profiles;
  DROP FUNCTION IF EXISTS public.sync_student_education_completed();
  DROP TABLE IF EXISTS public.student_profiles;

  DROP FUNCTION IF EXISTS public.generate_application_code();
  DROP FUNCTION IF EXISTS public.generate_student_code();
  DROP SEQUENCE IF EXISTS public.application_code_seq;
  DROP SEQUENCE IF EXISTS public.student_code_seq;
--------------------------------------------------------------------------------
*/
