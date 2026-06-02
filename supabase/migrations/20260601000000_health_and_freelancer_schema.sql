-- Health Connect Schema

-- Doctor Availability
CREATE TABLE IF NOT EXISTS doctor_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE doctor_availability ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view availability" ON doctor_availability FOR SELECT USING (true);
CREATE POLICY "Doctors can manage their availability" ON doctor_availability FOR ALL USING (auth.uid() = doctor_id);

-- Appointments
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    doctor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
    symptoms TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Patients can view own appointments" ON appointments FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Doctors can view own appointments" ON appointments FOR SELECT USING (auth.uid() = doctor_id);
CREATE POLICY "Patients can create appointments" ON appointments FOR INSERT WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "Doctors and patients can update appointments" ON appointments FOR UPDATE USING (auth.uid() = patient_id OR auth.uid() = doctor_id);

-- Prescriptions
CREATE TABLE IF NOT EXISTS prescriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE NOT NULL,
    patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    doctor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    medications JSONB NOT NULL DEFAULT '[]', -- Array of { name, dosage, frequency, duration }
    instructions TEXT,
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Patients can view own prescriptions" ON prescriptions FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Doctors can view and manage their prescriptions" ON prescriptions FOR ALL USING (auth.uid() = doctor_id);

-- Medical Records
CREATE TABLE IF NOT EXISTS medical_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    doctor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    record_type TEXT NOT NULL, -- e.g., 'lab_result', 'xray', 'general'
    description TEXT,
    file_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Patients can manage own records" ON medical_records FOR ALL USING (auth.uid() = patient_id);
CREATE POLICY "Doctors can view patient records" ON medical_records FOR SELECT USING (auth.uid() = doctor_id);


-- Freelancer Schema

-- Project Applications (Bids)
CREATE TABLE IF NOT EXISTS project_bids (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES live_projects(id) ON DELETE CASCADE NOT NULL,
    freelancer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    bid_amount INTEGER NOT NULL,
    cover_letter TEXT,
    estimated_days INTEGER,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(project_id, freelancer_id)
);

ALTER TABLE project_bids ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Freelancers can view own bids" ON project_bids FOR SELECT USING (auth.uid() = freelancer_id);
CREATE POLICY "Freelancers can create bids" ON project_bids FOR INSERT WITH CHECK (auth.uid() = freelancer_id);
CREATE POLICY "Freelancers can update own bids" ON project_bids FOR UPDATE USING (auth.uid() = freelancer_id);

-- Freelancer Earnings
CREATE TABLE IF NOT EXISTS freelancer_earnings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    freelancer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    project_id UUID REFERENCES live_projects(id) ON DELETE SET NULL,
    amount INTEGER NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'cleared', 'withdrawn')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    cleared_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE freelancer_earnings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Freelancers can view own earnings" ON freelancer_earnings FOR SELECT USING (auth.uid() = freelancer_id);

-- Project Milestones
CREATE TABLE IF NOT EXISTS project_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES live_projects(id) ON DELETE CASCADE NOT NULL,
    freelancer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    amount INTEGER NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'approved')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Freelancers can view and update own milestones" ON project_milestones FOR ALL USING (auth.uid() = freelancer_id);
