import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { Upload, X, FileText, Image, Video, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProjectFileUploadProps {
  label: string;
  currentUrl: string | null;
  onUpload: (url: string) => void;
  onRemove: () => void;
  accept?: string;
  folder: string;
  icon?: 'image' | 'file' | 'video';
}

const ProjectFileUpload = ({
  label,
  currentUrl,
  onUpload,
  onRemove,
  accept = '*/*',
  folder,
  icon = 'file',
}: ProjectFileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const IconComponent = icon === 'image' ? Image : icon === 'video' ? Video : FileText;

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Max 50MB allowed', variant: 'destructive' });
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error } = await supabase.storage
        .from('project-files')
        .upload(fileName, file, { upsert: true });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('project-files')
        .getPublicUrl(fileName);

      onUpload(urlData.publicUrl);
      toast({ title: `${label} uploaded successfully` });
    } catch (error: any) {
      toast({ title: 'Upload failed', description: error.message, variant: 'destructive' });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {currentUrl ? (
        <div className="flex items-center gap-2 p-2 border border-border rounded-md bg-muted/50">
          <IconComponent className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="text-sm text-foreground truncate flex-1">
            {currentUrl.split('/').pop()}
          </span>
          <Button variant="ghost" size="sm" onClick={onRemove} className="h-7 w-7 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div>
          <input
            ref={fileRef}
            type="file"
            accept={accept}
            onChange={handleUpload}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="w-full"
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            {uploading ? 'Uploading...' : `Upload ${label}`}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProjectFileUpload;
