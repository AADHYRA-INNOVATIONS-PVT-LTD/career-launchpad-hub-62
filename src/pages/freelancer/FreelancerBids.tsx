import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Loader2, IndianRupee, Clock } from 'lucide-react';

const FreelancerBids = () => {
  const { user } = useAuth();
  const [bids, setBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchBids();
  }, [user]);

  const fetchBids = async () => {
    try {
      const { data, error } = await supabase
        .from('project_bids')
        .select(`
          *,
          live_projects (
            title,
            budget,
            status
          )
        `)
        .eq('freelancer_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBids(data || []);
    } catch (error) {
      console.error('Error fetching bids:', error);
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
          <FileText className="h-8 w-8 text-primary" />
          My Proposals
        </h2>
        <p className="text-muted-foreground">Track the status of your submitted bids and proposals.</p>
      </div>

      {bids.length === 0 ? (
        <Card className="flex flex-col items-center justify-center h-48 border-dashed">
          <p className="text-muted-foreground font-medium">No bids submitted yet.</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {bids.map((bid) => (
            <Card key={bid.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{bid.live_projects?.title || 'Unknown Project'}</CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1">
                        <IndianRupee className="h-4 w-4 text-muted-foreground" />
                        Bid: {bid.bid_amount} (Budget: {bid.live_projects?.budget})
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        Est. Days: {bid.estimated_days}
                      </span>
                    </CardDescription>
                  </div>
                  <Badge variant={
                    bid.status === 'accepted' ? 'default' : 
                    bid.status === 'rejected' ? 'destructive' : 
                    'secondary'
                  } className="capitalize">
                    {bid.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-md">
                  <h4 className="text-sm font-semibold mb-2">Cover Letter</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{bid.cover_letter}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FreelancerBids;
