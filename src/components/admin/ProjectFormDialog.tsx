import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import ProjectFileUpload from './ProjectFileUpload';

interface Category {
  id: string;
  name: string;
}

export interface ProjectFormData {
  title: string;
  description: string;
  project_type: string;
  price: number;
  is_active: boolean;
  tech_stack: string;
  preview_url: string;
  category_id: string;
  thumbnail_url: string;
  source_code_url: string;
  documentation_url: string;
  demo_video_url: string;
}

interface ProjectFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: ProjectFormData;
  setFormData: (data: ProjectFormData) => void;
  onSubmit: () => void;
  saving: boolean;
  isEditing: boolean;
  categories: Category[];
}

const PROJECT_TYPES = [
  'live',
  'college',
  'mini',
  'major',
];

const ProjectFormDialog = ({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  saving,
  isEditing,
  categories,
}: ProjectFormDialogProps) => {
  const update = (field: keyof ProjectFormData, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Project' : 'Create New Project'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 overflow-y-auto pr-2 flex-1">
          <div className="space-y-2">
            <Label htmlFor="title">Project Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => update('title', e.target.value)}
              placeholder="e.g., E-commerce Website with Admin Panel"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Project Type</Label>
              <Select
                value={formData.project_type}
                onValueChange={(v) => update('project_type', v)}
              >
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  {PROJECT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={formData.category_id}
                onValueChange={(v) => update('category_id', v)}
              >
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (₹)</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => update('price', parseInt(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="Project description..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tech_stack">Tech Stack (comma-separated)</Label>
            <Input
              id="tech_stack"
              value={formData.tech_stack}
              onChange={(e) => update('tech_stack', e.target.value)}
              placeholder="e.g., React, Node.js, MongoDB"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="preview_url">Preview URL</Label>
            <Input
              id="preview_url"
              value={formData.preview_url}
              onChange={(e) => update('preview_url', e.target.value)}
              placeholder="https://demo.example.com"
            />
          </div>

          {/* File Uploads */}
          <div className="border-t border-border pt-4 space-y-3">
            <h4 className="text-sm font-semibold text-foreground">File Uploads</h4>
            <div className="grid grid-cols-2 gap-3">
              <ProjectFileUpload
                label="Thumbnail"
                currentUrl={formData.thumbnail_url || null}
                onUpload={(url) => update('thumbnail_url', url)}
                onRemove={() => update('thumbnail_url', '')}
                accept="image/*"
                folder="thumbnails"
                icon="image"
              />
              <ProjectFileUpload
                label="Source Code"
                currentUrl={formData.source_code_url || null}
                onUpload={(url) => update('source_code_url', url)}
                onRemove={() => update('source_code_url', '')}
                accept=".zip,.rar,.tar.gz,.7z"
                folder="source-code"
                icon="file"
              />
              <ProjectFileUpload
                label="Documentation"
                currentUrl={formData.documentation_url || null}
                onUpload={(url) => update('documentation_url', url)}
                onRemove={() => update('documentation_url', '')}
                accept=".pdf,.doc,.docx,.pptx"
                folder="docs"
                icon="file"
              />
              <ProjectFileUpload
                label="Demo Video"
                currentUrl={formData.demo_video_url || null}
                onUpload={(url) => update('demo_video_url', url)}
                onRemove={() => update('demo_video_url', '')}
                accept="video/*"
                folder="videos"
                icon="video"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="active"
              checked={formData.is_active}
              onCheckedChange={(checked) => update('is_active', checked)}
            />
            <Label htmlFor="active">Project is active</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onSubmit} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {isEditing ? 'Update Project' : 'Create Project'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectFormDialog;
