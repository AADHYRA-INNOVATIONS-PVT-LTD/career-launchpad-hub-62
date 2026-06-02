import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  ClipboardCheck,
  CreditCard,
  Play,
  Lock,
  CheckCircle,
  XCircle,
  Loader2,
  Monitor,
  Users,
  TrendingUp,
  Palette,
  Heart,
  AlertCircle,
} from 'lucide-react';
import PaymentModal from '@/components/shared/PaymentModal';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
}

interface InterviewStatus {
  paid: boolean;
  mcqCompleted: boolean;
  mcqPassed: boolean;
  codingCompleted: boolean;
  codingPassed: boolean;
  hrCompleted: boolean;
  hrPassed: boolean;
  finalStatus: 'pending' | 'selected' | 'rejected' | 'not_started';
}

const categoryIcons: Record<string, typeof Monitor> = {
  it: Monitor,
  hr: Users,
  'digital-marketing': TrendingUp,
  'graphic-design': Palette,
  nursing: Heart,
};

const DashboardInterview = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [interviewStatus, setInterviewStatus] = useState<InterviewStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await supabase
          .from('course_categories')
          .select('*');
        setCategories(data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const checkInterviewStatus = async (categoryId: string) => {
    if (!user) return;

    try {
      // Check payment status
      const { data: payment } = await supabase
        .from('interview_fee_payments')
        .select('status')
        .eq('user_id', user.id)
        .eq('course_id', categoryId)
        .maybeSingle();

      // Check interview attempts
      const { data: attempts } = await supabase
        .from('interview_attempts')
        .select('round, status, passed')
        .eq('user_id', user.id)
        .eq('course_id', categoryId);

      const mcq = attempts?.find(a => a.round === 'mcq');
      const coding = attempts?.find(a => a.round === 'coding');
      const hr = attempts?.find(a => a.round === 'hr');

      let finalStatus: InterviewStatus['finalStatus'] = 'not_started';
      
      if (payment?.status === 'success') {
        if (mcq?.status === 'completed' && !mcq.passed) {
          finalStatus = 'rejected';
        } else if (coding?.status === 'completed' && !coding.passed) {
          finalStatus = 'rejected';
        } else if (hr?.status === 'completed') {
          finalStatus = hr.passed ? 'selected' : 'rejected';
        } else {
          finalStatus = 'pending';
        }
      }

      setInterviewStatus({
        paid: payment?.status === 'success',
        mcqCompleted: mcq?.status === 'completed',
        mcqPassed: mcq?.passed || false,
        codingCompleted: coding?.status === 'completed',
        codingPassed: coding?.passed || false,
        hrCompleted: hr?.status === 'completed',
        hrPassed: hr?.passed || false,
        finalStatus,
      });
    } catch (error) {
      console.error('Error checking interview status:', error);
    }
  };

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    checkInterviewStatus(category.id);
  };

  const handlePaymentClick = () => {
    if (!selectedCategory || !user) return;
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async () => {
    if (!selectedCategory || !user) return;
    
    setPaymentLoading(true);
    
    try {
      // Create payment record
      const { error } = await supabase
        .from('interview_fee_payments')
        .upsert({
          user_id: user.id,
          course_id: selectedCategory.id,
          amount: 499,
          status: 'success', // For demo - in production, integrate with Razorpay
        }, { onConflict: 'user_id,course_id' });

      if (error) throw error;

      toast({
        title: 'Payment Successful!',
        description: 'You can now proceed with the interview rounds.',
      });

      await checkInterviewStatus(selectedCategory.id);
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: 'Payment Failed',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setPaymentLoading(false);
    }
  };

  const startInterview = (round: 'mcq' | 'coding' | 'hr') => {
    if (!selectedCategory) return;
    navigate(`/dashboard/interview/${selectedCategory.id}/${round}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold">Interview / Entrance Test</h2>
        <p className="text-muted-foreground">
          Complete the AI-powered interview to unlock course enrollment
        </p>
      </div>

      {!selectedCategory ? (
        <>
          <Card className="shadow-card border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">How it works</h3>
                  <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>Select your preferred training domain</li>
                    <li>Pay the evaluation fee of ₹499</li>
                    <li>Complete 3 AI-proctored rounds: MCQ, Coding (for IT), HR Interview</li>
                    <li>Get selected and enroll in your course!</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>

          <h3 className="text-lg font-semibold">Select Training Domain</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => {
              const IconComponent = categoryIcons[category.slug] || ClipboardCheck;
              return (
                <Card
                  key={category.id}
                  className="shadow-card hover:shadow-card-hover transition-all cursor-pointer border-2 hover:border-primary"
                  onClick={() => handleCategorySelect(category)}
                >
                  <CardContent className="p-6 text-center">
                    <div className={`h-16 w-16 rounded-xl bg-${category.color}/10 flex items-center justify-center mx-auto mb-4`}>
                      <IconComponent className={`h-8 w-8 text-${category.color}`} />
                    </div>
                    <h3 className="font-semibold mb-2">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <Button
            variant="ghost"
            onClick={() => {
              setSelectedCategory(null);
              setInterviewStatus(null);
            }}
          >
            ← Back to Categories
          </Button>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {(() => {
                  const IconComponent = categoryIcons[selectedCategory.slug] || ClipboardCheck;
                  return <IconComponent className="h-6 w-6" />;
                })()}
                {selectedCategory.name} - Entrance Interview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Payment Step */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      interviewStatus?.paid ? 'bg-healthcare/10' : 'bg-primary/10'
                    }`}>
                      {interviewStatus?.paid ? (
                        <CheckCircle className="h-5 w-5 text-healthcare" />
                      ) : (
                        <CreditCard className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium">Evaluation Fee</h4>
                      <p className="text-sm text-muted-foreground">₹499 one-time payment</p>
                    </div>
                  </div>
                  {interviewStatus?.paid ? (
                    <Badge className="bg-healthcare text-healthcare-foreground">Paid</Badge>
                  ) : (
                    <Button onClick={handlePaymentClick} disabled={paymentLoading}>
                      {paymentLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Pay Now
                    </Button>
                  )}
                </div>
              </div>

              {/* Round 1: MCQ */}
              <div className={`p-4 border rounded-lg ${!interviewStatus?.paid ? 'opacity-50' : ''}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      interviewStatus?.mcqCompleted
                        ? interviewStatus.mcqPassed ? 'bg-healthcare/10' : 'bg-destructive/10'
                        : 'bg-muted'
                    }`}>
                      {interviewStatus?.mcqCompleted ? (
                        interviewStatus.mcqPassed ? (
                          <CheckCircle className="h-5 w-5 text-healthcare" />
                        ) : (
                          <XCircle className="h-5 w-5 text-destructive" />
                        )
                      ) : (
                        <span className="font-bold text-muted-foreground">1</span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium">Round 1: MCQ Test</h4>
                      <p className="text-sm text-muted-foreground">
                        30 questions • 30 minutes • AI Proctored
                      </p>
                    </div>
                  </div>
                  {!interviewStatus?.paid ? (
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  ) : interviewStatus.mcqCompleted ? (
                    <Badge variant={interviewStatus.mcqPassed ? 'default' : 'destructive'}>
                      {interviewStatus.mcqPassed ? 'Passed' : 'Failed'}
                    </Badge>
                  ) : (
                    <Button onClick={() => startInterview('mcq')} className="gap-2">
                      <Play className="h-4 w-4" />
                      Start Test
                    </Button>
                  )}
                </div>
              </div>

              {/* Round 2: Coding (IT only) */}
              {selectedCategory.slug === 'it' && (
                <div className={`p-4 border rounded-lg ${
                  !interviewStatus?.mcqPassed ? 'opacity-50' : ''
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        interviewStatus?.codingCompleted
                          ? interviewStatus.codingPassed ? 'bg-healthcare/10' : 'bg-destructive/10'
                          : 'bg-muted'
                      }`}>
                        {interviewStatus?.codingCompleted ? (
                          interviewStatus.codingPassed ? (
                            <CheckCircle className="h-5 w-5 text-healthcare" />
                          ) : (
                            <XCircle className="h-5 w-5 text-destructive" />
                          )
                        ) : (
                          <span className="font-bold text-muted-foreground">2</span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium">Round 2: Coding Test</h4>
                        <p className="text-sm text-muted-foreground">
                          2 problems • 60 minutes • Live Compiler
                        </p>
                      </div>
                    </div>
                    {!interviewStatus?.mcqPassed ? (
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    ) : interviewStatus.codingCompleted ? (
                      <Badge variant={interviewStatus.codingPassed ? 'default' : 'destructive'}>
                        {interviewStatus.codingPassed ? 'Passed' : 'Failed'}
                      </Badge>
                    ) : (
                      <Button onClick={() => startInterview('coding')} className="gap-2">
                        <Play className="h-4 w-4" />
                        Start Test
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Round 3: HR Interview */}
              <div className={`p-4 border rounded-lg ${
                selectedCategory.slug === 'it'
                  ? !interviewStatus?.codingPassed ? 'opacity-50' : ''
                  : !interviewStatus?.mcqPassed ? 'opacity-50' : ''
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      interviewStatus?.hrCompleted
                        ? interviewStatus.hrPassed ? 'bg-healthcare/10' : 'bg-destructive/10'
                        : 'bg-muted'
                    }`}>
                      {interviewStatus?.hrCompleted ? (
                        interviewStatus.hrPassed ? (
                          <CheckCircle className="h-5 w-5 text-healthcare" />
                        ) : (
                          <XCircle className="h-5 w-5 text-destructive" />
                        )
                      ) : (
                        <span className="font-bold text-muted-foreground">
                          {selectedCategory.slug === 'it' ? '3' : '2'}
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium">
                        Round {selectedCategory.slug === 'it' ? '3' : '2'}: AI HR Interview
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Video interview • AI Evaluation • 15 minutes
                      </p>
                    </div>
                  </div>
                  {(selectedCategory.slug === 'it' ? !interviewStatus?.codingPassed : !interviewStatus?.mcqPassed) ? (
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  ) : interviewStatus?.hrCompleted ? (
                    <Badge variant={interviewStatus.hrPassed ? 'default' : 'destructive'}>
                      {interviewStatus.hrPassed ? 'Passed' : 'Failed'}
                    </Badge>
                  ) : (
                    <Button onClick={() => startInterview('hr')} className="gap-2">
                      <Play className="h-4 w-4" />
                      Start Interview
                    </Button>
                  )}
                </div>
              </div>

              {/* Final Status */}
              {interviewStatus?.finalStatus === 'selected' && (
                <div className="p-6 bg-healthcare/10 border border-healthcare/20 rounded-lg text-center">
                  <CheckCircle className="h-12 w-12 text-healthcare mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-healthcare mb-2">
                    Congratulations! You're Selected! 🎉
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    You can now enroll in {selectedCategory.name} courses
                  </p>
                  <Button className="bg-healthcare hover:bg-healthcare/90">
                    Proceed to Course Enrollment
                  </Button>
                </div>
              )}

              {interviewStatus?.finalStatus === 'rejected' && (
                <div className="p-6 bg-destructive/10 border border-destructive/20 rounded-lg text-center">
                  <XCircle className="h-12 w-12 text-destructive mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-destructive mb-2">
                    Better luck next time
                  </h3>
                  <p className="text-muted-foreground">
                    You can retry the interview after 30 days
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <PaymentModal
            isOpen={showPaymentModal}
            onClose={() => setShowPaymentModal(false)}
            amount={499}
            onSuccess={handlePaymentSuccess}
            title={`${selectedCategory.name} Evaluation Fee`}
            description="Complete this payment to unlock your interview rounds."
          />
        </>
      )}
    </div>
  );
};

export default DashboardInterview;
