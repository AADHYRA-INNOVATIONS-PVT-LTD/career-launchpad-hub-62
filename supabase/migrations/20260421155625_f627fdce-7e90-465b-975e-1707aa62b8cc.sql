CREATE TABLE public.campus_drive_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  college_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  designation TEXT,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  expected_students INTEGER,
  preferred_date DATE,
  drive_mode TEXT NOT NULL DEFAULT 'on-campus',
  departments TEXT[],
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.campus_drive_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a campus drive request"
  ON public.campus_drive_requests
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can manage campus drive requests"
  ON public.campus_drive_requests
  FOR ALL
  USING (is_admin());

CREATE TRIGGER update_campus_drive_requests_updated_at
  BEFORE UPDATE ON public.campus_drive_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();