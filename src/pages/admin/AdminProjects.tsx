import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Loader2, Code, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ProjectFormDialog, { type ProjectFormData } from '@/components/admin/ProjectFormDialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Project {
  id: string;
  title: string;
  description: string | null;
  project_type: string | null;
  price: number;
  is_active: boolean;
  tech_stack: string[] | null;
  preview_url: string | null;
  category_id: string | null;
  thumbnail_url: string | null;
  source_code_url: string | null;
  documentation_url: string | null;
  demo_video_url: string | null;
  category?: { name: string };
}

interface Category { id: string; name: string; }

const emptyForm: ProjectFormData = {
  title: '', description: '', project_type: '', price: 5000,
  is_active: true, tech_stack: '', preview_url: '', category_id: '',
  thumbnail_url: '', source_code_url: '', documentation_url: '', demo_video_url: '',
};

const AdminProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [formData, setFormData] = useState<ProjectFormData>(emptyForm);
  const { toast } = useToast();

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [projectsRes, categoriesRes] = await Promise.all([
        supabase.from('live_projects')
          .select('*, category:course_categories(name)')
          .order('created_at', { ascending: false }),
        supabase.from('course_categories').select('id, name').order('name'),
      ]);
      if (projectsRes.error) throw projectsRes.error;
      if (categoriesRes.error) throw categoriesRes.error;
      setProjects((projectsRes.data as any) || []);
      setCategories(categoriesRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateDialog = () => {
    setEditingProject(null);
    setFormData(emptyForm);
    setDialogOpen(true);
  };

  const openEditDialog = (p: Project) => {
    setEditingProject(p);
    setFormData({
      title: p.title,
      description: p.description || '',
      project_type: p.project_type || '',
      price: p.price,
      is_active: p.is_active,
      tech_stack: p.tech_stack?.join(', ') || '',
      preview_url: p.preview_url || '',
      category_id: p.category_id || '',
      thumbnail_url: p.thumbnail_url || '',
      source_code_url: p.source_code_url || '',
      documentation_url: p.documentation_url || '',
      demo_video_url: p.demo_video_url || '',
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      toast({ title: 'Validation Error', description: 'Please enter a project title', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      const data = {
        title: formData.title.trim(),
        description: formData.description || null,
        project_type: formData.project_type || null,
        price: formData.price,
        is_active: formData.is_active,
        tech_stack: formData.tech_stack ? formData.tech_stack.split(',').map(t => t.trim()).filter(Boolean) : null,
        preview_url: formData.preview_url || null,
        category_id: formData.category_id || null,
        thumbnail_url: formData.thumbnail_url || null,
        source_code_url: formData.source_code_url || null,
        documentation_url: formData.documentation_url || null,
        demo_video_url: formData.demo_video_url || null,
      };

      if (editingProject) {
        const { error } = await supabase.from('live_projects').update(data).eq('id', editingProject.id);
        if (error) throw error;
        toast({ title: 'Project updated successfully' });
      } else {
        const { error } = await supabase.from('live_projects').insert(data);
        if (error) throw error;
        toast({ title: 'Project created successfully' });
      }
      setDialogOpen(false);
      fetchData();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const { error } = await supabase.from('live_projects').delete().eq('id', deleteTarget.id);
      if (error) throw error;
      toast({ title: 'Project deleted' });
      setDeleteTarget(null);
      fetchData();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const toggleStatus = async (p: Project) => {
    try {
      const { error } = await supabase.from('live_projects').update({ is_active: !p.is_active }).eq('id', p.id);
      if (error) throw error;
      setProjects(projects.map(x => x.id === p.id ? { ...x, is_active: !x.is_active } : x));
      toast({ title: p.is_active ? 'Project deactivated' : 'Project activated' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const fileCount = (p: Project) =>
    [p.thumbnail_url, p.source_code_url, p.documentation_url, p.demo_video_url].filter(Boolean).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-bold">Project Management</h2>
          <p className="text-muted-foreground">Manage live projects, files, and college projects</p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Button>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            All Projects ({projects.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Files</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No projects found. Click "Add Project" to create one.
                      </TableCell>
                    </TableRow>
                  ) : (
                    projects.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {p.thumbnail_url ? (
                              <img src={p.thumbnail_url} alt="" className="h-10 w-10 rounded object-cover" />
                            ) : (
                              <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                                <Code className="h-5 w-5 text-muted-foreground" />
                              </div>
                            )}
                            <div className="max-w-[180px]">
                              <p className="font-medium truncate">{p.title}</p>
                              <div className="flex flex-wrap gap-1 mt-0.5">
                                {p.tech_stack?.slice(0, 2).map(t => (
                                  <Badge key={t} variant="outline" className="text-[10px] px-1 py-0">{t}</Badge>
                                ))}
                                {(p.tech_stack?.length || 0) > 2 && (
                                  <Badge variant="outline" className="text-[10px] px-1 py-0">+{p.tech_stack!.length - 2}</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="capitalize">{p.project_type || '-'}</TableCell>
                        <TableCell>{p.category?.name || '-'}</TableCell>
                        <TableCell>₹{p.price.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{fileCount(p)}/4</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={p.is_active ? 'default' : 'secondary'}
                            className={p.is_active ? 'bg-green-600 hover:bg-green-700' : ''}
                          >
                            {p.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="sm" onClick={() => openEditDialog(p)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => toggleStatus(p)}>
                              {p.is_active ? 'Off' : 'On'}
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(p)} className="text-destructive hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <ProjectFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        saving={saving}
        isEditing={!!editingProject}
        categories={categories}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteTarget?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminProjects;
