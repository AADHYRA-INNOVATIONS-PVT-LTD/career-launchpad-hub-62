import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Lock, CheckCircle2, Clock, Upload, AlertTriangle, PlayCircle, Loader2, Trophy, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { HR_TASKS } from '@/data/hrTasks';

interface SavedSubmission {
  id: string;
  task_id: string;
  submission_url: string | null;
  notes: string | null;
  mentor_feedback: string | null;
  submitted_at: string;
}

const DashboardHRTasks = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<SavedSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);
  const [candidates, setCandidates] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (user) load();
    const t = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(t);
  }, [user]);

  const load = async () => {
    const { data } = await supabase
      .from('internship_submissions')
      .select('*')
      .eq('user_id', user?.id)
      .in('task_id', HR_TASKS.map((t) => t.id))
      .order('submitted_at', { ascending: true });
    setSubmissions((data as any) || []);
    // active = first task without an approved/pending submission
    const subs = (data as any) || [];
    const firstIncomplete = HR_TASKS.findIndex((t) => !subs.find((s: any) => s.task_id === t.id));
    setActiveIdx(firstIncomplete === -1 ? HR_TASKS.length - 1 : firstIncomplete);
    setLoading(false);
  };

  const getSubmission = (taskId: string) => submissions.find((s) => s.task_id === taskId);
  const isCompleted = (taskId: string) => !!getSubmission(taskId);
  const isUnlocked = (idx: number) => idx === 0 || isCompleted(HR_TASKS[idx - 1].id);

  const getDeadline = (idx: number): number | null => {
    const task = HR_TASKS[idx];
    if (idx === 0) {
      const earliest = submissions[0]?.submitted_at ? new Date(submissions[0].submitted_at).getTime() : null;
      // Task 1 starts when user first opens — use a stored start time per task in localStorage
      const startKey = `hr_task_start_${task.id}_${user?.id}`;
      let start = parseInt(localStorage.getItem(startKey) || '0', 10);
      if (!start) {
        start = Date.now();
        localStorage.setItem(startKey, String(start));
      }
      return start + task.durationDays * 24 * 60 * 60 * 1000;
    }
    const prev = getSubmission(HR_TASKS[idx - 1].id);
    if (!prev) return null;
    return new Date(prev.submitted_at).getTime() + task.durationDays * 24 * 60 * 60 * 1000;
  };

  const isExpired = (idx: number) => {
    if (isCompleted(HR_TASKS[idx].id)) return false;
    const dl = getDeadline(idx);
    return dl !== null && now > dl;
  };

  const restart = async () => {
    if (!confirm('Restart from Task 1? This will clear your current progress.')) return;
    await supabase
      .from('internship_submissions')
      .delete()
      .eq('user_id', user?.id)
      .in('task_id', HR_TASKS.map((t) => t.id));
    HR_TASKS.forEach((t) => localStorage.removeItem(`hr_task_start_${t.id}_${user?.id}`));
    toast.success('Restarted from Task 1');
    load();
  };

  const submit = async () => {
    const task = HR_TASKS[activeIdx];
    if (candidates.trim().length < 5) return toast.error('Please list at least one candidate');
    if (!paymentFile) return toast.error('Please upload payment screenshot');
    setSubmitting(true);
    try {
      const ext = paymentFile.name.split('.').pop();
      const path = `task-proofs/${user?.id}/${task.id}-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from('project-files').upload(path, paymentFile);
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from('project-files').getPublicUrl(path);

      const payload = JSON.stringify({ candidates, notes, payment_screenshot: pub.publicUrl });
      const { error } = await supabase.from('internship_submissions').insert({
        task_id: task.id,
        user_id: user?.id,
        notes: payload,
        submission_url: pub.publicUrl,
      });
      if (error) throw error;
      toast.success(`Task ${task.number} submitted! Next task unlocked.`);
      setCandidates(''); setNotes(''); setPaymentFile(null);
      load();
    } catch (e: any) {
      toast.error(e.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  const completedCount = HR_TASKS.filter((t) => isCompleted(t.id)).length;
  const allDone = completedCount === HR_TASKS.length;
  const anyExpired = HR_TASKS.some((_, i) => isExpired(i));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold">HR Internship — Live Tasks</h2>
        <p className="text-muted-foreground">Complete each task in order. Miss the deadline → restart from Task 1 (certificate only, no stipend).</p>
      </div>

      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm text-muted-foreground">{completedCount} / {HR_TASKS.length} tasks</span>
          </div>
          <Progress value={(completedCount / HR_TASKS.length) * 100} className="h-2" />
        </CardContent>
      </Card>

      {anyExpired && !allDone && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="pt-6 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-destructive">Task expired</p>
              <p className="text-sm text-muted-foreground">You missed a deadline. You're no longer eligible for stipend — only certificate & experience letter. To restart and earn stipend again, begin from Task 1.</p>
            </div>
            <Button variant="destructive" size="sm" onClick={restart}><RotateCcw className="h-4 w-4 mr-1" /> Restart</Button>
          </CardContent>
        </Card>
      )}

      {HR_TASKS.map((task, idx) => {
        const unlocked = isUnlocked(idx);
        const completed = isCompleted(task.id);
        const expired = isExpired(idx);
        const isActive = idx === activeIdx && unlocked && !completed;
        const deadline = getDeadline(idx);
        const hoursLeft = deadline ? Math.max(0, Math.floor((deadline - now) / (1000 * 60 * 60))) : null;

        return (
          <Card key={task.id} className={`shadow-card ${!unlocked ? 'opacity-60' : ''} ${isActive ? 'border-primary border-2' : ''}`}>
            <CardHeader>
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-start gap-3">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold ${completed ? 'bg-green-100 text-green-700' : unlocked ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                    {completed ? <CheckCircle2 className="h-5 w-5" /> : !unlocked ? <Lock className="h-5 w-5" /> : task.number}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{task.title}</CardTitle>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{task.durationDays} days</Badge>
                      <Badge variant="secondary" className="text-xs">{task.payout}</Badge>
                      {completed && <Badge className="bg-green-100 text-green-800 text-xs">Completed</Badge>}
                      {expired && !completed && <Badge variant="destructive" className="text-xs">Expired</Badge>}
                      {hoursLeft !== null && unlocked && !completed && !expired && (
                        <Badge className="bg-amber-100 text-amber-800 text-xs gap-1"><Clock className="h-3 w-3" /> {hoursLeft}h left</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>

            {!unlocked ? (
              <CardContent>
                <div className="text-center py-6 text-muted-foreground">
                  <Lock className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Complete Task {task.number - 1} to unlock this task</p>
                </div>
              </CardContent>
            ) : (
              <CardContent className="space-y-4">
                {/* Video */}
                <div className="aspect-video rounded-lg overflow-hidden bg-muted border">
                  <iframe src={task.videoUrl} title={task.title} className="w-full h-full" allowFullScreen />
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-primary">
                  <PlayCircle className="h-4 w-4" /> Watch the explainer above
                </div>

                {/* Paragraph */}
                <div className="bg-muted/40 rounded-lg p-4 border">
                  <h4 className="font-semibold mb-2 text-sm">📖 What you need to do</h4>
                  <p className="text-sm text-foreground leading-relaxed">{task.paragraph}</p>
                </div>

                {/* Steps */}
                <div>
                  <h4 className="font-semibold mb-2 text-sm">✅ Step-by-step</h4>
                  <ol className="space-y-1.5">
                    {task.steps.map((s, i) => (
                      <li key={i} className="flex gap-2 text-sm">
                        <span className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Submission form OR completed state */}
                {completed ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                    <Trophy className="h-5 w-5 text-green-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-green-900">Task completed!</p>
                      <p className="text-green-700">Submitted on {new Date(getSubmission(task.id)!.submitted_at).toLocaleDateString('en-IN')}</p>
                    </div>
                  </div>
                ) : expired ? (
                  <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-sm">
                    <p className="font-semibold text-destructive mb-1">⏰ Time's up</p>
                    <p className="text-muted-foreground">You can no longer submit this task. Restart from Task 1 to remain eligible for stipend.</p>
                  </div>
                ) : isActive ? (
                  <div className="space-y-3 border-t pt-4">
                    <h4 className="font-semibold text-sm">📤 Submit your proof to unlock the next task</h4>
                    <div className="space-y-2">
                      <Label>{task.proofRequirements.candidates.label} *</Label>
                      <Textarea value={candidates} onChange={(e) => setCandidates(e.target.value)} placeholder={task.proofRequirements.candidates.placeholder} rows={4} />
                    </div>
                    <div className="space-y-2">
                      <Label>{task.proofRequirements.payment.label} *</Label>
                      <Input type="file" accept="image/*,.pdf" onChange={(e) => setPaymentFile(e.target.files?.[0] || null)} />
                      {paymentFile && <p className="text-xs text-muted-foreground">Selected: {paymentFile.name}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>{task.proofRequirements.notes.label}</Label>
                      <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={task.proofRequirements.notes.placeholder} rows={2} />
                    </div>
                    <Button onClick={submit} disabled={submitting} className="w-full gap-2" size="lg">
                      {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      Submit Task {task.number} & Unlock Next
                    </Button>
                  </div>
                ) : null}
              </CardContent>
            )}
          </Card>
        );
      })}

      {allDone && (
        <Card className="border-green-300 bg-green-50">
          <CardContent className="pt-6 text-center">
            <Trophy className="h-12 w-12 text-green-600 mx-auto mb-3" />
            <h3 className="font-bold text-lg text-green-900 mb-1">🎉 All tasks completed!</h3>
            <p className="text-sm text-green-700">Your stipend will be processed and certificate + experience letter issued shortly.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardHRTasks;