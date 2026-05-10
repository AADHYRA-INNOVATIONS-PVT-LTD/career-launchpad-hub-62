import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Users, BookOpen, CreditCard, Award, ClipboardCheck, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DashboardStats {
  totalStudents: number;
  totalCourses: number;
  totalPayments: number;
  totalCertificates: number;
  totalInterviews: number;
  passedInterviews: number;
}

interface ApplicationRow {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  course: string;
  vertical: string;
  status: string;
  created_at: string;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalCourses: 0,
    totalPayments: 0,
    totalCertificates: 0,
    totalInterviews: 0,
    passedInterviews: 0,
  });
  const [applications, setApplications] = useState<ApplicationRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchApplications();
  }, []);

  const fetchStats = async () => {
    try {
      const [
        studentsRes,
        coursesRes,
        paymentsRes,
        certificatesRes,
        interviewsRes,
        passedRes,
      ] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('courses').select('id', { count: 'exact', head: true }),
        supabase.from('course_payments').select('amount').eq('status', 'completed'),
        supabase.from('certificates').select('id', { count: 'exact', head: true }),
        supabase.from('interview_attempts').select('id', { count: 'exact', head: true }),
        supabase.from('interview_attempts').select('id', { count: 'exact', head: true }).eq('passed', true),
      ]);

      const totalPaymentAmount = paymentsRes.data?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

      setStats({
        totalStudents: studentsRes.count || 0,
        totalCourses: coursesRes.count || 0,
        totalPayments: totalPaymentAmount,
        totalCertificates: certificatesRes.count || 0,
        totalInterviews: interviewsRes.count || 0,
        passedInterviews: passedRes.count || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    const { data, error } = await supabase
      .from('applications')
      .select('id, full_name, phone, email, course, vertical, status, created_at')
      .order('created_at', { ascending: false })
      .limit(20);
    if (!error && data) setApplications(data as ApplicationRow[]);
  };

  const statCards = [
    {
      title: 'Total Students',
      value: stats.totalStudents,
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Active Courses',
      value: stats.totalCourses,
      icon: BookOpen,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalPayments.toLocaleString()}`,
      icon: CreditCard,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      title: 'Certificates Issued',
      value: stats.totalCertificates,
      icon: Award,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Total Interviews',
      value: stats.totalInterviews,
      icon: ClipboardCheck,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      title: 'Pass Rate',
      value: stats.totalInterviews > 0 
        ? `${Math.round((stats.passedInterviews / stats.totalInterviews) * 100)}%`
        : '0%',
      icon: TrendingUp,
      color: 'text-teal-500',
      bgColor: 'bg-teal-500/10',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold">Admin Dashboard</h2>
        <p className="text-muted-foreground">Overview of your platform performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? '...' : stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Recent Apply Now Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <p className="text-muted-foreground text-sm">No applications yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="py-2 pr-4 font-medium">Name</th>
                    <th className="py-2 pr-4 font-medium">Contact</th>
                    <th className="py-2 pr-4 font-medium">Course</th>
                    <th className="py-2 pr-4 font-medium">Vertical</th>
                    <th className="py-2 pr-4 font-medium">Status</th>
                    <th className="py-2 font-medium">Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((a) => (
                    <tr key={a.id} className="border-b last:border-0">
                      <td className="py-2 pr-4 font-medium">{a.full_name}</td>
                      <td className="py-2 pr-4">
                        <div>{a.email}</div>
                        <div className="text-xs text-muted-foreground">{a.phone}</div>
                      </td>
                      <td className="py-2 pr-4">{a.course}</td>
                      <td className="py-2 pr-4"><Badge variant="secondary">{a.vertical}</Badge></td>
                      <td className="py-2 pr-4"><Badge>{a.status}</Badge></td>
                      <td className="py-2 text-muted-foreground text-xs">
                        {new Date(a.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-muted-foreground text-sm">
              Use the sidebar to navigate to different management sections:
            </p>
            <ul className="text-sm space-y-1 mt-2">
              <li>• <strong>Students</strong> - View all registered students</li>
              <li>• <strong>Courses</strong> - Add and manage courses</li>
              <li>• <strong>Interviews</strong> - Review interview recordings</li>
              <li>• <strong>Payments</strong> - Track all transactions</li>
              <li>• <strong>Certificates</strong> - Issue and verify certificates</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
