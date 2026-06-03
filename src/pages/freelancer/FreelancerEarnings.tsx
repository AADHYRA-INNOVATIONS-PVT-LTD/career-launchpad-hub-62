import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, IndianRupee, TrendingUp, CheckCircle, Clock } from 'lucide-react';

const FreelancerEarnings = () => {
  const { user } = useAuth();
  const [earnings, setEarnings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchEarnings();
  }, [user]);

  const fetchEarnings = async () => {
    try {
      const { data, error } = await supabase
        .from('freelancer_earnings')
        .select(`
          *,
          live_projects (
            title
          )
        `)
        .eq('freelancer_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEarnings(data || []);
    } catch (error) {
      console.error('Error fetching earnings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  const totalCleared = earnings.filter(e => e.status === 'cleared').reduce((acc, curr) => acc + curr.amount, 0);
  const totalPending = earnings.filter(e => e.status === 'pending').reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-3xl font-heading font-bold mb-2 flex items-center gap-2">
          <TrendingUp className="h-8 w-8 text-primary" />
          Earnings & Payments
        </h2>
        <p className="text-muted-foreground">Manage your freelance income and payment history.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardDescription className="text-primary font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Cleared Earnings
            </CardDescription>
            <CardTitle className="text-4xl text-primary flex items-center">
              <IndianRupee className="h-8 w-8 mr-1" />
              {totalCleared.toLocaleString('en-IN')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Available for withdrawal.</p>
          </CardContent>
        </Card>
        
        <Card className="bg-orange-50 border-orange-200">
          <CardHeader className="pb-2">
            <CardDescription className="text-orange-700 font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending Clearance
            </CardDescription>
            <CardTitle className="text-4xl text-orange-700 flex items-center">
              <IndianRupee className="h-8 w-8 mr-1" />
              {totalPending.toLocaleString('en-IN')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Currently in escrow or awaiting client approval.</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          {earnings.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No earnings history found.</p>
          ) : (
            <div className="divide-y">
              {earnings.map((earning) => (
                <div key={earning.id} className="py-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{earning.live_projects?.title || 'General Payment'}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(earning.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold flex items-center justify-end">
                      <IndianRupee className="h-4 w-4 mr-1" />
                      {earning.amount.toLocaleString('en-IN')}
                    </p>
                    <Badge variant={earning.status === 'cleared' ? 'default' : 'secondary'} className="mt-1 capitalize">
                      {earning.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FreelancerEarnings;
