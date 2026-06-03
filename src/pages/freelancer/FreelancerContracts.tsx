import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Briefcase, Calendar, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FreelancerContracts = () => {
  const { user } = useAuth();
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchContracts();
  }, [user]);

  const fetchContracts = async () => {
    try {
      // In this schema, a contract is basically an accepted bid.
      const { data, error } = await supabase
        .from('project_bids')
        .select(`
          *,
          live_projects (
            title,
            description,
            deadline
          )
        `)
        .eq('freelancer_id', user!.id)
        .eq('status', 'accepted')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setContracts(data || []);
    } catch (error) {
      console.error('Error fetching contracts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-3xl font-heading font-bold mb-2 flex items-center gap-2">
          <Briefcase className="h-8 w-8 text-primary" />
          Active Contracts
        </h2>
        <p className="text-muted-foreground">Manage your ongoing freelance projects and deliveries.</p>
      </div>

      {contracts.length === 0 ? (
        <Card className="flex flex-col items-center justify-center h-48 border-dashed">
          <CheckCircle2 className="h-10 w-10 text-muted-foreground opacity-50 mb-3" />
          <p className="text-lg font-medium text-muted-foreground">No active contracts</p>
          <p className="text-sm text-muted-foreground">Submit more proposals to win projects!</p>
        </Card>
      ) : (
        <div className="grid gap-6">
          {contracts.map((contract) => (
            <Card key={contract.id} className="border-l-4 border-l-primary">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl mb-1">{contract.live_projects?.title}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Started: {new Date(contract.updated_at).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-primary/5 text-primary">
                    Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm bg-muted/50 p-4 rounded-lg">
                    <div>
                      <span className="block text-muted-foreground mb-1">Agreed Amount</span>
                      <span className="font-semibold text-lg">₹{contract.bid_amount}</span>
                    </div>
                    <div>
                      <span className="block text-muted-foreground mb-1">Deadline</span>
                      <span className="font-semibold text-lg">{new Date(contract.live_projects?.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button variant="default" className="flex-1">Submit Work</Button>
                    <Button variant="outline" className="flex-1">Message Client</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FreelancerContracts;
