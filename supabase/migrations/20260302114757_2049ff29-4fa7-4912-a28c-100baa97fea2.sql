
-- Create storage bucket for project files
INSERT INTO storage.buckets (id, name, public) VALUES ('project-files', 'project-files', true);

-- Allow admins to upload project files
CREATE POLICY "Admins can upload project files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'project-files' AND public.is_admin());

-- Allow admins to update project files
CREATE POLICY "Admins can update project files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'project-files' AND public.is_admin());

-- Allow admins to delete project files
CREATE POLICY "Admins can delete project files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'project-files' AND public.is_admin());

-- Allow anyone to view project files (public bucket)
CREATE POLICY "Anyone can view project files"
ON storage.objects FOR SELECT
USING (bucket_id = 'project-files');

-- Add columns for file URLs to live_projects
ALTER TABLE public.live_projects
ADD COLUMN IF NOT EXISTS thumbnail_url text,
ADD COLUMN IF NOT EXISTS source_code_url text,
ADD COLUMN IF NOT EXISTS documentation_url text,
ADD COLUMN IF NOT EXISTS demo_video_url text;
