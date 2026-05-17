
CREATE TABLE public.college_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  college_name TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  official_email TEXT NOT NULL,
  mobile TEXT NOT NULL,
  designation TEXT NOT NULL,
  department TEXT NOT NULL,
  city TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.college_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit college registration"
ON public.college_registrations FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view college registrations"
ON public.college_registrations FOR SELECT
USING (public.is_admin());

CREATE POLICY "Admins can update college registrations"
ON public.college_registrations FOR UPDATE
USING (public.is_admin());

CREATE POLICY "Admins can delete college registrations"
ON public.college_registrations FOR DELETE
USING (public.is_admin());

CREATE TRIGGER update_college_registrations_updated_at
BEFORE UPDATE ON public.college_registrations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_college_registrations_created_at ON public.college_registrations(created_at DESC);
