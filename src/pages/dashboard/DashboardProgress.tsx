import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, Trophy, Clock, TrendingUp, CheckCircle2, XCircle,
  Target, Award, BarChart3, Calendar, Flame, Zap, Medal, Star
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, RadialBarChart, RadialBar, Legend,
  AreaChart, Area
} from 'recharts';
import { format } from 'date-fns';

interface Enrollment {
  id: string; course_id: string; progress: number; status: string;
  enrolled_at: string; completed_at: string | null;
  courses: { id: string; title: string; duration: string | null; };
}

interface ExamAttempt {
  id: string; exam_id: string; score: number | null; max_score: number | null;
  passed: boolean | null; completed_at: string | null;
  module_exams: {
    id: string; title: string; pass_percentage: number | null;
    course_modules: { id: string; title: string; order_index: number; courses: { id: string; title: string; }; };
  };
}

interface InterviewAttempt {
  id: string; round: string; score: number | null; max_score: number | null;
  passed: boolean | null; completed_at: string | null; status: string;
}

interface ProgressStats {
  totalCourses: number; completedCourses: number; inProgressCourses: number;
  totalExams: number; passedExams: number; averageScore: number;
  totalInterviews: number; passedInterviews: number; certificates: number;
}

const CHART_COLORS = ['hsl(var(--primary))', 'hsl(var(--healthcare))', 'hsl(var(--accent))', 'hsl(var(--tech))', 'hsl(var(--design))'];

const DashboardProgress = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [examAttempts, setExamAttempts] = useState<ExamAttempt[]>([]);
  const [interviewAttempts, setInterviewAttempts] = useState<InterviewAttempt[]>([]);
  const [stats, setStats] = useState<ProgressStats>({
    totalCourses: 0, completedCourses: 0, inProgressCourses: 0,
    totalExams: 0, passedExams: 0, averageScore: 0,
    totalInterviews: 0, passedInterviews: 0, certificates: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (user) fetchProgressData(); }, [user]);

  const fetchProgressData = async () => {
    try {
      setLoading(true);
      const [enrollmentRes, examRes, interviewRes, certRes] = await Promise.all([
        supabase.from('enrollments').select('id, course_id, progress, status, enrolled_at, completed_at, courses(id, title, duration)').eq('user_id', user!.id).order('enrolled_at', { ascending: false }),
        supabase.from('exam_attempts').select('id, exam_id, score, max_score, passed, completed_at, module_exams(id, title, pass_percentage, course_modules(id, title, order_index, courses(id, title)))').eq('user_id', user!.id).not('completed_at', 'is', null).order('completed_at', { ascending: false }),
        supabase.from('interview_attempts').select('id, round, score, max_score, passed, completed_at, status').eq('user_id', user!.id).order('completed_at', { ascending: false }),
        supabase.from('certificates').select('id').eq('user_id', user!.id),
      ]);

      const typedEnrollments = (enrollmentRes.data || []) as unknown as Enrollment[];
      const typedExamAttempts = (examRes.data || []) as unknown as ExamAttempt[];
      const typedInterviews = (interviewRes.data || []) as unknown as InterviewAttempt[];

      setEnrollments(typedEnrollments);
      setExamAttempts(typedExamAttempts);
      setInterviewAttempts(typedInterviews);

      const completedCourses = typedEnrollments.filter(e => e.status === 'completed').length;
      const inProgressCourses = typedEnrollments.filter(e => e.status === 'active').length;
      const passedExams = typedExamAttempts.filter(e => e.passed === true).length;
      const totalScore = typedExamAttempts.reduce((sum, e) => {
        if (e.score !== null && e.max_score !== null && e.max_score > 0) return sum + (e.score / e.max_score) * 100;
        return sum;
      }, 0);
      const averageScore = typedExamAttempts.length > 0 ? totalScore / typedExamAttempts.length : 0;
      const passedInterviews = typedInterviews.filter(i => i.passed === true).length;

      setStats({
        totalCourses: typedEnrollments.length, completedCourses, inProgressCourses,
        totalExams: typedExamAttempts.length, passedExams,
        averageScore: Math.round(averageScore),
        totalInterviews: typedInterviews.length, passedInterviews,
        certificates: certRes.data?.length || 0,
      });
    } catch (error) { console.error('Error fetching progress data:', error); }
    finally { setLoading(false); }
  };

  const courseProgressData = enrollments.map(e => ({
    name: (e.courses?.title || 'Course').substring(0, 18), progress: e.progress || 0
  }));

  const examScoreData = examAttempts.slice(0, 10).map(e => ({
    name: (e.module_exams?.course_modules?.title || 'Exam').substring(0, 14),
    score: e.score !== null && e.max_score !== null ? Math.round((e.score / e.max_score) * 100) : 0,
    passed: e.passed
  }));

  const examTrendData = [...examAttempts].reverse().map((e, i) => ({
    exam: i + 1,
    score: e.score !== null && e.max_score !== null ? Math.round((e.score / e.max_score) * 100) : 0,
  }));

  const pieChartData = [
    { name: 'Completed', value: stats.completedCourses, color: 'hsl(var(--primary))' },
    { name: 'In Progress', value: stats.inProgressCourses, color: 'hsl(var(--healthcare))' },
    { name: 'Pending', value: Math.max(0, stats.totalCourses - stats.completedCourses - stats.inProgressCourses), color: 'hsl(var(--muted))' }
  ].filter(d => d.value > 0);

  const overallProgress = stats.totalCourses > 0 ? Math.round((stats.completedCourses / stats.totalCourses) * 100) : 0;

  const radialData = [
    { name: 'Overall', value: overallProgress, fill: 'hsl(var(--primary))' },
  ];

  if (loading) {
    return <div className="p-6 flex items-center justify-center min-h-[400px]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Progress Report</h1>
        <p className="text-muted-foreground">Comprehensive analytics of your learning journey</p>
      </div>

      {/* Overall Progress Ring + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Progress Ring */}
        <Card className="lg:col-span-2 shadow-card">
          <CardContent className="pt-6 flex flex-col items-center">
            <div className="relative h-40 w-40">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" data={radialData} startAngle={90} endAngle={-270}>
                  <RadialBar background dataKey="value" cornerRadius={10} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-foreground">{overallProgress}%</span>
                <span className="text-xs text-muted-foreground">Overall</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2 text-center">
              {stats.completedCourses} of {stats.totalCourses} courses completed
            </p>
          </CardContent>
        </Card>

        {/* Quick Stats Grid */}
        <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { icon: BookOpen, label: 'Enrolled', value: stats.totalCourses, color: 'primary' },
            { icon: Trophy, label: 'Completed', value: stats.completedCourses, color: 'healthcare' },
            { icon: Flame, label: 'In Progress', value: stats.inProgressCourses, color: 'accent' },
            { icon: Target, label: 'Exams Passed', value: `${stats.passedExams}/${stats.totalExams}`, color: 'tech' },
            { icon: TrendingUp, label: 'Avg Score', value: `${stats.averageScore}%`, color: 'design' },
            { icon: Medal, label: 'Certificates', value: stats.certificates, color: 'marketing' },
          ].map((stat, i) => (
            <Card key={i} className="shadow-card">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg bg-${stat.color}/15`}>
                    <stat.icon className={`h-4 w-4 text-${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground">{stat.label}</p>
                    <p className="text-lg font-bold text-foreground">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Interview Stats */}
      {stats.totalInterviews > 0 && (
        <Card className="shadow-card bg-gradient-to-r from-design/5 to-tech/5 border-design/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-design/15"><Zap className="h-5 w-5 text-design" /></div>
                <div>
                  <p className="font-semibold text-foreground">Interview Performance</p>
                  <p className="text-sm text-muted-foreground">{stats.passedInterviews} passed out of {stats.totalInterviews} attempts</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {interviewAttempts.slice(0, 3).map((ia, i) => (
                  <Badge key={i} variant={ia.passed ? 'default' : 'secondary'} className={ia.passed ? 'bg-healthcare' : ''}>
                    {ia.round} {ia.passed ? '✓' : '✗'}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Charts */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <BarChart3 className="h-4 w-4 mr-2" /> Overview
          </TabsTrigger>
          <TabsTrigger value="courses" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <BookOpen className="h-4 w-4 mr-2" /> Courses
          </TabsTrigger>
          <TabsTrigger value="exams" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Award className="h-4 w-4 mr-2" /> Exams
          </TabsTrigger>
          <TabsTrigger value="timeline" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Calendar className="h-4 w-4 mr-2" /> Timeline
          </TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="text-lg">Course Progress</CardTitle><CardDescription>Progress across enrolled courses</CardDescription></CardHeader>
              <CardContent>
                {courseProgressData.length > 0 ? (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={courseProgressData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
                        <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11 }} />
                        <Tooltip formatter={(v) => [`${v}%`, 'Progress']} contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                        <Bar dataKey="progress" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : <div className="h-[300px] flex items-center justify-center text-muted-foreground">No course data</div>}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-lg">Course Status</CardTitle><CardDescription>Distribution overview</CardDescription></CardHeader>
              <CardContent>
                {pieChartData.length > 0 ? (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={pieChartData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                          {pieChartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : <div className="h-[300px] flex items-center justify-center text-muted-foreground">No course data</div>}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-lg">Exam Scores</CardTitle><CardDescription>Recent module exam performance</CardDescription></CardHeader>
              <CardContent>
                {examScoreData.length > 0 ? (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={examScoreData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                        <Tooltip formatter={(v) => [`${v}%`, 'Score']} contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                        <Bar dataKey="score" radius={[4, 4, 0, 0]} fill="hsl(var(--healthcare))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : <div className="h-[300px] flex items-center justify-center text-muted-foreground">No exam data</div>}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-lg">Score Trend</CardTitle><CardDescription>Your exam performance over time</CardDescription></CardHeader>
              <CardContent>
                {examTrendData.length > 1 ? (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={examTrendData}>
                        <defs>
                          <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="exam" tick={{ fontSize: 12 }} label={{ value: 'Exam #', position: 'insideBottom', offset: -5 }} />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                        <Tooltip formatter={(v) => [`${v}%`, 'Score']} contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                        <Area type="monotone" dataKey="score" stroke="hsl(var(--primary))" fill="url(#scoreGradient)" strokeWidth={2} dot={{ fill: 'hsl(var(--primary))' }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                ) : <div className="h-[300px] flex items-center justify-center text-muted-foreground">{examTrendData.length === 1 ? 'Need more exams for trend' : 'No exam data'}</div>}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Courses Tab */}
        <TabsContent value="courses" className="space-y-4">
          {enrollments.length > 0 ? (
            <div className="grid gap-4">
              {enrollments.map((enrollment) => (
                <Card key={enrollment.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-foreground">{enrollment.courses?.title}</h3>
                          <Badge variant={enrollment.status === 'completed' ? 'default' : 'secondary'} className={enrollment.status === 'completed' ? 'bg-primary' : ''}>
                            {enrollment.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {format(new Date(enrollment.enrolled_at), 'MMM d, yyyy')}</span>
                          {enrollment.courses?.duration && <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {enrollment.courses.duration}</span>}
                        </div>
                      </div>
                      <div className="w-full sm:w-48">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{enrollment.progress || 0}%</span>
                        </div>
                        <Progress value={enrollment.progress || 0} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card><CardContent className="p-12 text-center"><BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><h3 className="text-lg font-semibold mb-2">No Courses Enrolled</h3><p className="text-muted-foreground">Start your learning journey by enrolling in a course.</p></CardContent></Card>
          )}
        </TabsContent>

        {/* Exams Tab */}
        <TabsContent value="exams" className="space-y-4">
          {examAttempts.length > 0 ? (
            <div className="grid gap-4">
              {examAttempts.map((attempt) => (
                <Card key={attempt.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {attempt.passed ? <CheckCircle2 className="h-5 w-5 text-healthcare" /> : <XCircle className="h-5 w-5 text-destructive" />}
                          <h3 className="font-semibold text-foreground">{attempt.module_exams?.title || 'Module Exam'}</h3>
                          <Badge variant={attempt.passed ? 'default' : 'destructive'} className={attempt.passed ? 'bg-healthcare' : ''}>{attempt.passed ? 'Passed' : 'Failed'}</Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span>Course: {attempt.module_exams?.course_modules?.courses?.title || 'N/A'}</span>
                          <span>Module: {attempt.module_exams?.course_modules?.title || 'N/A'}</span>
                          {attempt.completed_at && <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {format(new Date(attempt.completed_at), 'MMM d, yyyy')}</span>}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-foreground">{attempt.score !== null && attempt.max_score !== null ? Math.round((attempt.score / attempt.max_score) * 100) : 0}%</div>
                        <div className="text-sm text-muted-foreground">{attempt.score || 0} / {attempt.max_score || 0} pts</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card><CardContent className="p-12 text-center"><Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><h3 className="text-lg font-semibold mb-2">No Exams Taken</h3><p className="text-muted-foreground">Complete course modules to unlock exams.</p></CardContent></Card>
          )}
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-lg">Learning Timeline</CardTitle><CardDescription>Your activity history</CardDescription></CardHeader>
            <CardContent>
              <div className="relative pl-6 space-y-6">
                <div className="absolute top-0 bottom-0 left-2 w-0.5 bg-border" />
                {enrollments.map((e, i) => (
                  <div key={e.id} className="relative">
                    <div className={`absolute -left-4 top-1 w-4 h-4 rounded-full border-2 ${e.status === 'completed' ? 'bg-primary border-primary' : 'bg-card border-primary'}`} />
                    <div className="ml-2">
                      <p className="font-medium text-foreground text-sm">{e.courses?.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="outline" className="text-xs">{e.status}</Badge>
                        <span className="text-xs text-muted-foreground">{format(new Date(e.enrolled_at), 'MMM d, yyyy')}</span>
                        {e.completed_at && <span className="text-xs text-healthcare">→ {format(new Date(e.completed_at), 'MMM d, yyyy')}</span>}
                      </div>
                      <Progress value={e.progress || 0} className="h-1.5 mt-2 w-48" />
                    </div>
                  </div>
                ))}
                {enrollments.length === 0 && (
                  <p className="text-muted-foreground text-sm ml-2">No activity yet. Enroll in a course to start your timeline.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardProgress;
