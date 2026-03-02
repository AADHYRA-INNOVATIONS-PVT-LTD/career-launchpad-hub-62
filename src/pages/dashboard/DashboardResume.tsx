import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, Download, Plus, Trash2, Loader2,
  User, Briefcase, GraduationCap, Award, Code, Save, Eye, Sparkles,
  Palette, Layout, Zap, Star, Crown, Gem
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ResumeData {
  id: string;
  personal_info: {
    name: string; email: string; phone: string;
    address: string; linkedin: string; summary: string;
  };
  education: Array<{ degree: string; institution: string; year: string; grade: string; }>;
  experience: Array<{ title: string; company: string; duration: string; description: string; }>;
  skills: string[];
  projects: Array<{ name: string; description: string; technologies: string; }>;
  certifications: Array<{ name: string; issuer: string; date: string; }>;
  template: string;
}

const templates = [
  { id: 'modern', name: 'Modern', description: 'Clean lines with accent sidebar', icon: Layout, color: 'from-primary/20 to-primary/5', border: 'border-primary/30', preview: 'bg-primary' },
  { id: 'professional', name: 'Professional', description: 'Traditional ATS-friendly format', icon: Briefcase, color: 'from-foreground/10 to-foreground/5', border: 'border-foreground/20', preview: 'bg-foreground' },
  { id: 'creative', name: 'Creative', description: 'Bold colors with unique layout', icon: Palette, color: 'from-accent/20 to-accent/5', border: 'border-accent/30', preview: 'bg-accent' },
  { id: 'minimal', name: 'Minimal', description: 'Typography-focused elegance', icon: Zap, color: 'from-muted to-muted/50', border: 'border-border', preview: 'bg-muted-foreground' },
  { id: 'executive', name: 'Executive', description: 'Premium corporate design', icon: Crown, color: 'from-design/20 to-design/5', border: 'border-design/30', preview: 'bg-design' },
  { id: 'tech', name: 'Developer', description: 'Code-inspired for tech roles', icon: Code, color: 'from-healthcare/20 to-healthcare/5', border: 'border-healthcare/30', preview: 'bg-healthcare' },
  { id: 'elegant', name: 'Elegant', description: 'Refined serif typography', icon: Gem, color: 'from-marketing/20 to-marketing/5', border: 'border-marketing/30', preview: 'bg-marketing' },
  { id: 'impact', name: 'Impact', description: 'High-contrast for max visibility', icon: Star, color: 'from-tech/20 to-tech/5', border: 'border-tech/30', preview: 'bg-tech' },
];

const DashboardResume = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [showPreview, setShowPreview] = useState(false);

  const defaultResumeData: Omit<ResumeData, 'id'> = {
    personal_info: { name: profile?.full_name || '', email: user?.email || '', phone: profile?.mobile || '', address: '', linkedin: '', summary: '' },
    education: [{ degree: '', institution: '', year: '', grade: '' }],
    experience: [], skills: [], projects: [], certifications: [], template: 'modern'
  };

  useEffect(() => { if (user) fetchResumeData(); }, [user]);

  const fetchResumeData = async () => {
    try {
      const { data, error } = await supabase.from('resume_data').select('*').eq('user_id', user?.id).single();
      if (error && error.code !== 'PGRST116') throw error;
      if (data) {
        setResumeData({
          ...data,
          personal_info: data.personal_info as ResumeData['personal_info'] || defaultResumeData.personal_info,
          education: data.education as ResumeData['education'] || defaultResumeData.education,
          experience: data.experience as ResumeData['experience'] || defaultResumeData.experience,
          skills: data.skills as string[] || defaultResumeData.skills,
          projects: data.projects as ResumeData['projects'] || defaultResumeData.projects,
          certifications: data.certifications as ResumeData['certifications'] || defaultResumeData.certifications,
        });
        setSelectedTemplate(data.template || 'modern');
      }
    } catch (error) { console.error('Error fetching resume:', error); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const dataToSave = {
        user_id: user?.id,
        personal_info: resumeData?.personal_info || defaultResumeData.personal_info,
        education: resumeData?.education || defaultResumeData.education,
        experience: resumeData?.experience || defaultResumeData.experience,
        skills: resumeData?.skills || defaultResumeData.skills,
        projects: resumeData?.projects || defaultResumeData.projects,
        certifications: resumeData?.certifications || defaultResumeData.certifications,
        template: selectedTemplate
      };
      if (resumeData?.id) {
        const { error } = await supabase.from('resume_data').update(dataToSave).eq('id', resumeData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('resume_data').insert(dataToSave);
        if (error) throw error;
      }
      toast({ title: 'Resume Saved', description: 'Your resume has been saved successfully.' });
      fetchResumeData();
    } catch (error) {
      console.error('Error saving resume:', error);
      toast({ title: 'Save Failed', description: 'Please try again later.', variant: 'destructive' });
    } finally { setSaving(false); }
  };

  const updatePersonalInfo = (field: string, value: string) => {
    setResumeData(prev => ({ ...prev!, personal_info: { ...(prev?.personal_info || defaultResumeData.personal_info), [field]: value } }));
  };

  const addEducation = () => setResumeData(prev => ({ ...prev!, education: [...(prev?.education || []), { degree: '', institution: '', year: '', grade: '' }] }));
  const updateEducation = (i: number, f: string, v: string) => setResumeData(prev => ({ ...prev!, education: (prev?.education || []).map((e, idx) => idx === i ? { ...e, [f]: v } : e) }));
  const removeEducation = (i: number) => setResumeData(prev => ({ ...prev!, education: (prev?.education || []).filter((_, idx) => idx !== i) }));

  const addExperience = () => setResumeData(prev => ({ ...prev!, experience: [...(prev?.experience || []), { title: '', company: '', duration: '', description: '' }] }));
  const updateExperience = (i: number, f: string, v: string) => setResumeData(prev => ({ ...prev!, experience: (prev?.experience || []).map((e, idx) => idx === i ? { ...e, [f]: v } : e) }));
  const removeExperience = (i: number) => setResumeData(prev => ({ ...prev!, experience: (prev?.experience || []).filter((_, idx) => idx !== i) }));

  const addProject = () => setResumeData(prev => ({ ...prev!, projects: [...(prev?.projects || []), { name: '', description: '', technologies: '' }] }));
  const updateProject = (i: number, f: string, v: string) => setResumeData(prev => ({ ...prev!, projects: (prev?.projects || []).map((p, idx) => idx === i ? { ...p, [f]: v } : p) }));
  const removeProject = (i: number) => setResumeData(prev => ({ ...prev!, projects: (prev?.projects || []).filter((_, idx) => idx !== i) }));

  const [skillInput, setSkillInput] = useState('');
  const addSkill = () => { if (skillInput.trim()) { setResumeData(prev => ({ ...prev!, skills: [...(prev?.skills || []), skillInput.trim()] })); setSkillInput(''); } };
  const removeSkill = (i: number) => setResumeData(prev => ({ ...prev!, skills: (prev?.skills || []).filter((_, idx) => idx !== i) }));

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  const personalInfo = resumeData?.personal_info || defaultResumeData.personal_info;
  const education = resumeData?.education || defaultResumeData.education;
  const experience = resumeData?.experience || defaultResumeData.experience;
  const skills = resumeData?.skills || defaultResumeData.skills;
  const projects = resumeData?.projects || defaultResumeData.projects;
  const currentTemplate = templates.find(t => t.id === selectedTemplate) || templates[0];

  // Resume Preview Component
  const ResumePreview = () => (
    <div className="bg-card border border-border rounded-lg shadow-lg max-w-[800px] mx-auto">
      {/* Header based on template */}
      <div className={`p-6 rounded-t-lg bg-gradient-to-r ${currentTemplate.color}`}>
        <div className="flex items-start gap-4">
          <div className={`h-16 w-16 rounded-full ${currentTemplate.preview} flex items-center justify-center text-white text-2xl font-bold`}>
            {personalInfo.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">{personalInfo.name || 'Your Name'}</h1>
            <div className="flex flex-wrap gap-3 mt-1 text-sm text-muted-foreground">
              {personalInfo.email && <span>{personalInfo.email}</span>}
              {personalInfo.phone && <span>• {personalInfo.phone}</span>}
              {personalInfo.address && <span>• {personalInfo.address}</span>}
            </div>
            {personalInfo.linkedin && <p className="text-sm text-primary mt-1">{personalInfo.linkedin}</p>}
          </div>
        </div>
        {personalInfo.summary && <p className="mt-3 text-sm text-foreground/80 leading-relaxed">{personalInfo.summary}</p>}
      </div>

      <div className="p-6 space-y-5">
        {/* Education */}
        {education.some(e => e.degree) && (
          <div>
            <h3 className={`text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b-2 ${currentTemplate.border}`}>Education</h3>
            {education.filter(e => e.degree).map((edu, i) => (
              <div key={i} className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-foreground text-sm">{edu.degree}</p>
                  <p className="text-muted-foreground text-xs">{edu.institution}</p>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <p>{edu.year}</p>
                  {edu.grade && <p className="font-medium">{edu.grade}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Experience */}
        {experience.some(e => e.title) && (
          <div>
            <h3 className={`text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b-2 ${currentTemplate.border}`}>Experience</h3>
            {experience.filter(e => e.title).map((exp, i) => (
              <div key={i} className="mb-3">
                <div className="flex justify-between"><p className="font-semibold text-foreground text-sm">{exp.title}</p><p className="text-xs text-muted-foreground">{exp.duration}</p></div>
                <p className="text-xs text-primary">{exp.company}</p>
                {exp.description && <p className="text-xs text-muted-foreground mt-1">{exp.description}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {projects.some(p => p.name) && (
          <div>
            <h3 className={`text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b-2 ${currentTemplate.border}`}>Projects</h3>
            {projects.filter(p => p.name).map((proj, i) => (
              <div key={i} className="mb-2">
                <p className="font-semibold text-foreground text-sm">{proj.name}</p>
                {proj.technologies && <p className="text-xs text-primary">{proj.technologies}</p>}
                {proj.description && <p className="text-xs text-muted-foreground mt-0.5">{proj.description}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div>
            <h3 className={`text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b-2 ${currentTemplate.border}`}>Skills</h3>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill, i) => (
                <Badge key={i} variant="secondary" className="text-xs">{skill}</Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (showPreview) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-heading font-bold">Resume Preview</h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              <FileText className="h-4 w-4 mr-2" /> Back to Editor
            </Button>
            <Button variant="outline"><Download className="h-4 w-4 mr-2" /> Download PDF</Button>
          </div>
        </div>
        <Badge className="text-xs">{currentTemplate.name} Template</Badge>
        <ResumePreview />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-bold">Resume Builder</h2>
          <p className="text-muted-foreground">Create your professional resume with advanced templates</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowPreview(true)}><Eye className="h-4 w-4 mr-2" /> Preview</Button>
          <Button variant="outline"><Download className="h-4 w-4 mr-2" /> Download PDF</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />} Save
          </Button>
        </div>
      </div>

      {/* Template Selection */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5" /> Choose Template</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
            {templates.map(t => {
              const Icon = t.icon;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTemplate(t.id)}
                  className={`p-3 border-2 rounded-lg cursor-pointer transition-all hover:scale-[1.02] ${
                    selectedTemplate === t.id ? `${t.border} bg-gradient-to-br ${t.color}` : 'border-border hover:border-primary/30'
                  }`}
                >
                  <div className={`h-20 rounded mb-2 bg-gradient-to-br ${t.color} flex flex-col items-center justify-center gap-1`}>
                    <Icon className="h-6 w-6 text-foreground/70" />
                    <div className="flex gap-0.5">
                      <div className={`h-1 w-6 rounded ${t.preview}`} />
                      <div className={`h-1 w-3 rounded ${t.preview} opacity-50`} />
                    </div>
                    <div className="flex gap-0.5 mt-0.5">
                      <div className="h-0.5 w-8 rounded bg-muted-foreground/20" />
                    </div>
                    <div className="flex gap-0.5">
                      <div className="h-0.5 w-5 rounded bg-muted-foreground/15" />
                      <div className="h-0.5 w-4 rounded bg-muted-foreground/15" />
                    </div>
                  </div>
                  <h4 className="font-semibold text-sm">{t.name}</h4>
                  <p className="text-xs text-muted-foreground">{t.description}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Resume Sections */}
      <Tabs defaultValue="personal" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="personal"><User className="h-4 w-4 mr-1" /> Personal</TabsTrigger>
          <TabsTrigger value="education"><GraduationCap className="h-4 w-4 mr-1" /> Education</TabsTrigger>
          <TabsTrigger value="experience"><Briefcase className="h-4 w-4 mr-1" /> Experience</TabsTrigger>
          <TabsTrigger value="projects"><Code className="h-4 w-4 mr-1" /> Projects</TabsTrigger>
          <TabsTrigger value="skills"><Zap className="h-4 w-4 mr-1" /> Skills</TabsTrigger>
          <TabsTrigger value="certifications"><Award className="h-4 w-4 mr-1" /> Certs</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card className="shadow-card">
            <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2"><Label>Full Name</Label><Input value={personalInfo.name} onChange={(e) => updatePersonalInfo('name', e.target.value)} placeholder="John Doe" /></div>
                <div className="space-y-2"><Label>Email</Label><Input type="email" value={personalInfo.email} onChange={(e) => updatePersonalInfo('email', e.target.value)} placeholder="john@example.com" /></div>
                <div className="space-y-2"><Label>Phone</Label><Input value={personalInfo.phone} onChange={(e) => updatePersonalInfo('phone', e.target.value)} placeholder="+91 9876543210" /></div>
                <div className="space-y-2"><Label>LinkedIn</Label><Input value={personalInfo.linkedin} onChange={(e) => updatePersonalInfo('linkedin', e.target.value)} placeholder="linkedin.com/in/username" /></div>
              </div>
              <div className="space-y-2"><Label>Address</Label><Input value={personalInfo.address} onChange={(e) => updatePersonalInfo('address', e.target.value)} placeholder="City, State" /></div>
              <div className="space-y-2"><Label>Professional Summary</Label><Textarea value={personalInfo.summary} onChange={(e) => updatePersonalInfo('summary', e.target.value)} placeholder="Brief summary..." rows={4} /></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="education">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Education</CardTitle>
              <Button variant="outline" size="sm" onClick={addEducation}><Plus className="h-4 w-4 mr-2" /> Add</Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {education.map((edu, i) => (
                <div key={i} className="p-4 border rounded-lg space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Education {i + 1}</h4>
                    {education.length > 1 && <Button variant="ghost" size="sm" onClick={() => removeEducation(i)}><Trash2 className="h-4 w-4 text-destructive" /></Button>}
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2"><Label>Degree</Label><Input value={edu.degree} onChange={(e) => updateEducation(i, 'degree', e.target.value)} placeholder="B.Tech in CS" /></div>
                    <div className="space-y-2"><Label>Institution</Label><Input value={edu.institution} onChange={(e) => updateEducation(i, 'institution', e.target.value)} placeholder="University" /></div>
                    <div className="space-y-2"><Label>Year</Label><Input value={edu.year} onChange={(e) => updateEducation(i, 'year', e.target.value)} placeholder="2020-2024" /></div>
                    <div className="space-y-2"><Label>Grade</Label><Input value={edu.grade} onChange={(e) => updateEducation(i, 'grade', e.target.value)} placeholder="8.5 CGPA" /></div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="experience">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Work Experience</CardTitle>
              <Button variant="outline" size="sm" onClick={addExperience}><Plus className="h-4 w-4 mr-2" /> Add</Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {experience.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No experience added yet</p>
                  <Button variant="outline" className="mt-2" onClick={addExperience}><Plus className="h-4 w-4 mr-2" /> Add Experience</Button>
                </div>
              ) : experience.map((exp, i) => (
                <div key={i} className="p-4 border rounded-lg space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Experience {i + 1}</h4>
                    <Button variant="ghost" size="sm" onClick={() => removeExperience(i)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2"><Label>Job Title</Label><Input value={exp.title} onChange={(e) => updateExperience(i, 'title', e.target.value)} placeholder="Software Developer" /></div>
                    <div className="space-y-2"><Label>Company</Label><Input value={exp.company} onChange={(e) => updateExperience(i, 'company', e.target.value)} placeholder="Company" /></div>
                    <div className="space-y-2 md:col-span-2"><Label>Duration</Label><Input value={exp.duration} onChange={(e) => updateExperience(i, 'duration', e.target.value)} placeholder="Jan 2022 - Present" /></div>
                    <div className="space-y-2 md:col-span-2"><Label>Description</Label><Textarea value={exp.description} onChange={(e) => updateExperience(i, 'description', e.target.value)} placeholder="Responsibilities..." rows={3} /></div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Projects</CardTitle>
              <Button variant="outline" size="sm" onClick={addProject}><Plus className="h-4 w-4 mr-2" /> Add</Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {projects.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No projects added yet</p>
                  <Button variant="outline" className="mt-2" onClick={addProject}><Plus className="h-4 w-4 mr-2" /> Add Project</Button>
                </div>
              ) : projects.map((proj, i) => (
                <div key={i} className="p-4 border rounded-lg space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Project {i + 1}</h4>
                    <Button variant="ghost" size="sm" onClick={() => removeProject(i)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2"><Label>Name</Label><Input value={proj.name} onChange={(e) => updateProject(i, 'name', e.target.value)} placeholder="Project Name" /></div>
                    <div className="space-y-2"><Label>Technologies</Label><Input value={proj.technologies} onChange={(e) => updateProject(i, 'technologies', e.target.value)} placeholder="React, Node.js" /></div>
                    <div className="space-y-2 md:col-span-2"><Label>Description</Label><Textarea value={proj.description} onChange={(e) => updateProject(i, 'description', e.target.value)} placeholder="What you built..." rows={2} /></div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills">
          <Card className="shadow-card">
            <CardHeader><CardTitle>Skills</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} placeholder="Add a skill..." onKeyDown={(e) => e.key === 'Enter' && addSkill()} />
                <Button onClick={addSkill}><Plus className="h-4 w-4" /></Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, i) => (
                  <Badge key={i} variant="secondary" className="px-3 py-1.5 text-sm">
                    {skill}
                    <button onClick={() => removeSkill(i)} className="ml-2 hover:text-destructive">×</button>
                  </Badge>
                ))}
              </div>
              {skills.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Add your technical and soft skills</p>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certifications">
          <Card className="shadow-card">
            <CardHeader><CardTitle>Certifications</CardTitle></CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Your earned certificates will appear here automatically</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardResume;
