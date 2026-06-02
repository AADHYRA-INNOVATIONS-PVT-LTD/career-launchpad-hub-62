-- 1. Add user_type column to profiles to distinguish between dashboards
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS user_type TEXT DEFAULT 'student';

-- 2. Update enrollments for progress tracking
ALTER TABLE enrollments 
ADD COLUMN IF NOT EXISTS progress INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- 3. Create interview fee payments tracking table
CREATE TABLE IF NOT EXISTS interview_fee_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    amount NUMERIC DEFAULT 499.00,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_user_fee UNIQUE (user_id)
);

-- 4. Create evaluation test attempts tracking table
CREATE TABLE IF NOT EXISTS interview_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    round TEXT NOT NULL, 
    passed BOOLEAN DEFAULT false,
    score INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create resume repository tracking table
CREATE TABLE IF NOT EXISTS resume_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    resume_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_user_resume UNIQUE (user_id)
);

-- 6. Enable Security Controls (RLS)
ALTER TABLE interview_fee_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_data ENABLE ROW LEVEL SECURITY;

-- 7. Secure Row-Level Access Policies
DROP POLICY IF EXISTS "Users can view their own fee status" ON interview_fee_payments;
CREATE POLICY "Users can view their own fee status" ON interview_fee_payments FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own interview attempts" ON interview_attempts;
CREATE POLICY "Users can view their own interview attempts" ON interview_attempts FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own interview attempts" ON interview_attempts;
CREATE POLICY "Users can insert their own interview attempts" ON interview_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own resume data" ON resume_data;
CREATE POLICY "Users can manage their own resume data" ON resume_data FOR ALL USING (auth.uid() = user_id);