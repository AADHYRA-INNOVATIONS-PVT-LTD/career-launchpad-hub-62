import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Image as ImageIcon, Plus, FolderOpen, ExternalLink, Edit, Loader2, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  tech_stack: string[];
  image_url: string | null;
  live_url: string | null;
}

const FreelancerPortfolio = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [techStack, setTechStack] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');

  useEffect(() => {
    if (user) {
      fetchPortfolio();
    }
  }, [user]);

  const fetchPortfolio = async () => {
    try {
      const { data, error } = await supabase
        .from('freelancer_portfolio_projects')
        .select('*')
        .eq('freelancer_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) {
        // If the table doesn't exist yet, don't crash the UI
        if (error.code === '42P01') {
          console.warn('Portfolio table missing. Awaiting migration.');
          setProjects([]);
          return;
        }
        throw error;
      }
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);
    try {
      const techArray = techStack.split(',').map(t => t.trim()).filter(Boolean);

      const { error } = await supabase
        .from('freelancer_portfolio_projects')
        .insert({
          freelancer_id: user.id,
          title,
          category,
          tech_stack: techArray,
          image_url: imageUrl || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&q=80', // Fallback image
          live_url: liveUrl || null
        });

      if (error) throw error;

      toast({ title: 'Project Added successfully!' });
      
      // Reset form
      setTitle('');
      setCategory('');
      setTechStack('');
      setImageUrl('');
      setLiveUrl('');
      setAddOpen(false);
      
      fetchPortfolio(); // Refresh
    } catch (error: any) {
      toast({ title: 'Failed to add project', description: error.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const { error } = await supabase
        .from('freelancer_portfolio_projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: 'Project deleted' });
      fetchPortfolio();
    } catch (error: any) {
      toast({ title: 'Failed to delete', description: error.message, variant: 'destructive' });
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-heading font-bold mb-1 flex items-center gap-2">
            <FolderOpen className="h-8 w-8 text-primary" />
            My Portfolio
          </h2>
          <p className="text-muted-foreground">Showcase your best work to win more projects.</p>
        </div>
        
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add Portfolio Project</DialogTitle>
              <DialogDescription>
                Showcase a project you've built.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddProject} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Project Title</Label>
                <Input required value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. E-Commerce Dashboard" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input required value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. Web Development" />
                </div>
                <div className="space-y-2">
                  <Label>Live URL (Optional)</Label>
                  <Input type="url" value={liveUrl} onChange={e => setLiveUrl(e.target.value)} placeholder="https://..." />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Tech Stack (Comma Separated)</Label>
                <Input required value={techStack} onChange={e => setTechStack(e.target.value)} placeholder="React, Node.js, Tailwind..." />
              </div>
              <div className="space-y-2">
                <Label>Image URL (Optional)</Label>
                <Input type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://unsplash.com/..." />
                <p className="text-xs text-muted-foreground">Leave blank to use a default placeholder image.</p>
              </div>
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setAddOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={submitting}>
                  {submitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  Save Project
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="mb-8">
        <CardContent className="p-6 flex items-center gap-6">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary font-heading font-bold text-3xl">
            {profile?.full_name?.charAt(0) || 'F'}
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold">{profile?.full_name || 'Freelancer'}</h3>
            <p className="text-muted-foreground">Full Stack Developer | UI/UX Designer</p>
            <div className="flex gap-2 mt-3">
              <Badge variant="secondary">React</Badge>
              <Badge variant="secondary">TypeScript</Badge>
              <Badge variant="secondary">Figma</Badge>
            </div>
          </div>
          <Button variant="outline" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      {projects.length === 0 ? (
        <Card className="flex flex-col items-center justify-center h-48 border-dashed">
          <ImageIcon className="h-10 w-10 text-muted-foreground opacity-30 mb-3" />
          <p className="text-muted-foreground font-medium">No projects added yet.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((item) => (
            <Card key={item.id} className="overflow-hidden group hover:shadow-lg transition-all relative">
              <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => handleDelete(item.id)}
                  disabled={deletingId === item.id}
                >
                  {deletingId === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                </Button>
              </div>
              <div className="relative h-48 bg-muted overflow-hidden">
                <img 
                  src={item.image_url || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&q=80'} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  {item.live_url ? (
                    <a href={item.live_url} target="_blank" rel="noopener noreferrer">
                      <Button variant="secondary" size="sm" className="gap-2">
                        <ExternalLink className="h-4 w-4" /> View Live
                      </Button>
                    </a>
                  ) : (
                    <span className="text-white text-sm font-medium">No Live URL</span>
                  )}
                </div>
              </div>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-1">
                  <Badge variant="outline" className="text-xs">{item.category}</Badge>
                </div>
                <CardTitle className="text-lg">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-1.5 flex-wrap">
                  {item.tech_stack?.map(t => (
                    <Badge key={t} variant="secondary" className="text-[10px] px-1.5 py-0">
                      {t}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FreelancerPortfolio;
