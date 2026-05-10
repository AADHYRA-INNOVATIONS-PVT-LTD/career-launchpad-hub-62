CREATE TABLE public.applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  course TEXT NOT NULL,
  vertical TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit an application"
ON public.applications FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view applications"
ON public.applications FOR SELECT
USING (is_admin());

CREATE POLICY "Admins can update applications"
ON public.applications FOR UPDATE
USING (is_admin());

CREATE POLICY "Admins can delete applications"
ON public.applications FOR DELETE
USING (is_admin());

CREATE POLICY "Users can view their own applications"
ON public.applications FOR SELECT
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE TRIGGER update_applications_updated_at
BEFORE UPDATE ON public.applications
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_applications_created_at ON public.applications(created_at DESC);
CREATE INDEX idx_applications_status ON public.applications(status);