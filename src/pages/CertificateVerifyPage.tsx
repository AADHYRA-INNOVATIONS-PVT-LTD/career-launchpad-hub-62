import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Shield, Search, CheckCircle, XCircle, Loader2, Award, QrCode, GraduationCap, Star } from 'lucide-react';

interface VerifiedCert {
  certificate_id: string;
  certificate_type: string;
  issue_date: string;
  verified: boolean;
  course_title: string;
  holder_name: string;
}

const CertificateVerifyPage = () => {
  const [certId, setCertId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerifiedCert | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleVerify = async () => {
    if (!certId.trim()) return;
    setLoading(true);
    setNotFound(false);
    setResult(null);
    setSearched(true);

    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('certificate_id, certificate_type, issue_date, verified, course_id, user_id')
        .eq('certificate_id', certId.trim())
        .maybeSingle();

      if (error || !data) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      // Fetch course title and holder name
      const [courseRes, profileRes] = await Promise.all([
        supabase.from('courses').select('title').eq('id', data.course_id).maybeSingle(),
        supabase.from('profiles').select('full_name').eq('user_id', data.user_id).maybeSingle(),
      ]);

      setResult({
        certificate_id: data.certificate_id,
        certificate_type: data.certificate_type,
        issue_date: data.issue_date,
        verified: data.verified ?? false,
        course_title: courseRes.data?.title || 'Course',
        holder_name: profileRes.data?.full_name || 'Student',
      });
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'completion': return 'Course Completion';
      case 'internship': return 'Internship Completion';
      default: return 'Certificate of Excellence';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section className="gradient-hero text-primary-foreground py-16">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary-foreground/20 mb-4">
                <Shield className="h-8 w-8" />
              </div>
              <h1 className="font-heading text-3xl md:text-4xl font-bold mb-3">Certificate Verification</h1>
              <p className="text-primary-foreground/80">Verify the authenticity of Aadhyra Innovations certificates using the Certificate ID or QR code</p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container max-w-2xl">
            {/* Search Box */}
            <Card className="shadow-card mb-8">
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <Input
                    placeholder="Enter Certificate ID (e.g., SN-2026-XXXXX)"
                    value={certId}
                    onChange={(e) => setCertId(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                    className="flex-1"
                  />
                  <Button onClick={handleVerify} disabled={loading || !certId.trim()}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Search className="h-4 w-4 mr-2" /> Verify</>}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Result */}
            {searched && !loading && (
              <>
                {result ? (
                  <Card className="shadow-card overflow-hidden">
                    <div className={`p-6 text-center ${result.verified ? 'bg-gradient-to-r from-primary/10 to-primary/5' : 'bg-gradient-to-r from-accent/10 to-accent/5'}`}>
                      {result.verified ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                            <CheckCircle className="h-8 w-8 text-primary" />
                          </div>
                          <Badge className="bg-primary/10 text-primary border-primary/20 text-sm">✅ Verified Certificate</Badge>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <div className="h-16 w-16 rounded-full bg-accent/20 flex items-center justify-center">
                            <Award className="h-8 w-8 text-accent" />
                          </div>
                          <Badge variant="outline" className="text-accent border-accent/30 text-sm">⏳ Verification Pending</Badge>
                        </div>
                      )}
                    </div>

                    {/* Certificate Preview */}
                    <div className="p-6">
                      <div className="border-4 border-double border-primary/20 rounded-lg p-6 bg-gradient-to-br from-card to-primary/5 relative">
                        <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-primary/30 rounded-tl-lg" />
                        <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-primary/30 rounded-tr-lg" />
                        <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-primary/30 rounded-bl-lg" />
                        <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-primary/30 rounded-br-lg" />

                        <div className="text-center space-y-3">
                          <div className="flex justify-center gap-1">
                            {[...Array(3)].map((_, i) => <Star key={i} className="h-4 w-4 text-accent fill-accent" />)}
                          </div>
                          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Aadhyra Innovations Academy</p>
                          <h2 className="text-xl font-heading font-bold text-foreground">{getTypeName(result.certificate_type)}</h2>
                          <div className="py-2">
                            <p className="text-sm text-muted-foreground">Awarded to</p>
                            <p className="text-xl font-bold text-primary">{result.holder_name}</p>
                          </div>
                          <p className="text-sm text-muted-foreground">for successfully completing <span className="font-medium text-foreground">{result.course_title}</span></p>
                          <div className="flex justify-center gap-6 pt-3">
                            <div className="text-center">
                              <div className="h-px w-24 bg-border mb-1" />
                              <p className="text-xs text-muted-foreground">Date: {new Date(result.issue_date).toLocaleDateString('en-IN')}</p>
                            </div>
                            <div className="bg-muted p-1.5 rounded"><QrCode className="h-8 w-8 text-muted-foreground" /></div>
                            <div className="text-center">
                              <div className="h-px w-24 bg-border mb-1" />
                              <p className="text-xs text-muted-foreground">Director, Aadhyra Innovations</p>
                            </div>
                          </div>
                          <p className="text-[10px] text-muted-foreground pt-2">Certificate ID: {result.certificate_id}</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ) : notFound ? (
                  <Card className="shadow-card">
                    <CardContent className="py-12 text-center">
                      <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                        <XCircle className="h-8 w-8 text-destructive" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Certificate Not Found</h3>
                      <p className="text-muted-foreground text-sm max-w-md mx-auto">
                        No certificate found with ID "<span className="font-mono font-medium">{certId}</span>". Please check the ID and try again.
                      </p>
                    </CardContent>
                  </Card>
                ) : null}
              </>
            )}

            {/* Info */}
            <Card className="mt-8 border-dashed border-primary/30 bg-gradient-to-r from-primary/5 to-transparent">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10"><GraduationCap className="h-6 w-6 text-primary" /></div>
                  <div>
                    <h4 className="font-semibold mb-1">How to Verify</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Enter the Certificate ID printed on the certificate</li>
                      <li>• Or scan the QR code on the certificate</li>
                      <li>• Verified certificates show a green badge</li>
                      <li>• For queries, contact support@Aadhyra Innovations.com</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CertificateVerifyPage;
