import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid,
} from "recharts";
import { Users, BookOpen, CreditCard, Award, ShoppingBag, Briefcase, Loader2 } from "lucide-react";

const COLORS = ["hsl(var(--primary))", "hsl(var(--healthcare))", "hsl(var(--accent))", "hsl(var(--marketing))", "hsl(var(--design))"];

const AdminAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState({ students: 0, courses: 0, revenue: 0, certs: 0, projectsSold: 0, internships: 0 });
  const [byDept, setByDept] = useState<{ name: string; projects: number; sold: number }[]>([]);
  const [revByDept, setRevByDept] = useState<{ name: string; value: number }[]>([]);
  const [signupsTrend, setSignupsTrend] = useState<{ date: string; signups: number }[]>([]);

  useEffect(() => { void load(); }, []);

  const load = async () => {
    try {
      const [studentsRes, coursesRes, certsRes, intRes, paymentsRes, projPaymentsRes, projectsRes, profilesRes, categoriesRes] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("courses").select("id", { count: "exact", head: true }),
        supabase.from("certificates").select("id", { count: "exact", head: true }),
        supabase.from("internships").select("id", { count: "exact", head: true }),
        supabase.from("course_payments").select("amount, status"),
        supabase.from("project_purchases").select("amount, project_id, status"),
        supabase.from("live_projects").select("id, category_id"),
        supabase.from("profiles").select("created_at"),
        supabase.from("course_categories").select("id, name"),
      ]);

      const courseRev = (paymentsRes.data || []).filter(p => p.status === "completed").reduce((s, p) => s + (p.amount || 0), 0);
      const projRev = (projPaymentsRes.data || []).filter(p => p.status === "completed").reduce((s, p) => s + (p.amount || 0), 0);

      setKpis({
        students: studentsRes.count || 0,
        courses: coursesRes.count || 0,
        revenue: courseRev + projRev,
        certs: certsRes.count || 0,
        projectsSold: (projPaymentsRes.data || []).filter(p => p.status === "completed").length,
        internships: intRes.count || 0,
      });

      // Department-wise project counts + sold
      const cats = categoriesRes.data || [];
      const projects = projectsRes.data || [];
      const purchases = (projPaymentsRes.data || []).filter(p => p.status === "completed");

      const dept = cats.map(c => {
        const projIds = projects.filter(p => p.category_id === c.id).map(p => p.id);
        const sold = purchases.filter(p => projIds.includes(p.project_id)).length;
        return { name: c.name, projects: projIds.length, sold };
      });
      setByDept(dept);

      // Revenue distribution by dept (using sold * 5000 as proxy)
      setRevByDept(dept.map(d => ({ name: d.name, value: d.sold * 5000 })).filter(d => d.value > 0));

      // Signups last 14 days
      const now = new Date();
      const days = Array.from({ length: 14 }).map((_, i) => {
        const d = new Date(now);
        d.setDate(d.getDate() - (13 - i));
        return d.toISOString().slice(0, 10);
      });
      const counts = days.map(date => ({
        date: date.slice(5),
        signups: (profilesRes.data || []).filter(p => p.created_at?.slice(0, 10) === date).length,
      }));
      setSignupsTrend(counts);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-96"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  const kpiCards = [
    { label: "Total Students", value: kpis.students, icon: Users, color: "text-primary" },
    { label: "Active Courses", value: kpis.courses, icon: BookOpen, color: "text-healthcare" },
    { label: "Total Revenue", value: `₹${kpis.revenue.toLocaleString()}`, icon: CreditCard, color: "text-accent" },
    { label: "Certificates Issued", value: kpis.certs, icon: Award, color: "text-marketing" },
    { label: "Projects Sold", value: kpis.projectsSold, icon: ShoppingBag, color: "text-design" },
    { label: "Internships", value: kpis.internships, icon: Briefcase, color: "text-primary" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold">Analytics Dashboard</h2>
        <p className="text-muted-foreground">Department-wise performance, revenue and growth analytics</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpiCards.map(k => (
          <Card key={k.label} className="shadow-card">
            <CardContent className="p-4">
              <k.icon className={`h-5 w-5 ${k.color} mb-2`} />
              <div className="text-2xl font-bold">{k.value}</div>
              <div className="text-xs text-muted-foreground">{k.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader><CardTitle className="text-lg">Projects by Department</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={byDept}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                <Legend />
                <Bar dataKey="projects" fill="hsl(var(--primary))" name="Available" radius={[4, 4, 0, 0]} />
                <Bar dataKey="sold" fill="hsl(var(--accent))" name="Sold" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader><CardTitle className="text-lg">Revenue Share by Department</CardTitle></CardHeader>
          <CardContent>
            {revByDept.length === 0 ? (
              <div className="h-[280px] flex items-center justify-center text-sm text-muted-foreground">
                No project sales yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={revByDept} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={(e) => `${e.name}`}>
                    {revByDept.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card lg:col-span-2">
          <CardHeader><CardTitle className="text-lg">Student Signups (Last 14 Days)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={signupsTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                <Line type="monotone" dataKey="signups" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;
