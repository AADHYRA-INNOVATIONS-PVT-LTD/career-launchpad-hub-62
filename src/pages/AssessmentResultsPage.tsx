import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Award,
  Briefcase,
  GraduationCap,
  IndianRupee,
  TrendingUp,
  Users,
  Zap,
  Star,
  Mail,
  Phone,
  MessageCircle,
  Sparkles,
  Building2,
  Target,
  FileText,
  PlayCircle,
} from "lucide-react";

// This page shows assessment results and next steps
// In production, status would come from Supabase based on user's interview record

type AssessmentStatus = "shortlisted" | "waiting" | "not_selected";

const internshipBenefits = [
  { icon: PlayCircle, title: "Live Projects", description: "Work on real-world projects with industry mentors" },
  { icon: Award, title: "Internship Certificate", description: "Get an officially verified internship certificate" },
  { icon: IndianRupee, title: "Performance-based Stipend", description: "Earn ₹5,000 – ₹15,000/month based on performance" },
  { icon: Briefcase, title: "Full-time Opportunity", description: "Top performers receive full-time job offers" },
  { icon: TrendingUp, title: "Career Growth", description: "Structured learning path with mentorship and reviews" },
  { icon: Building2, title: "Industry Experience", description: "Gain experience across IT, HR, Marketing & Design verticals" },
];

const AssessmentResultsPage = () => {
  // In production, this would be fetched from Supabase interview_attempts table
  const [status] = useState<AssessmentStatus>("waiting");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="gradient-hero text-primary-foreground py-12 lg:py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <Badge className="mb-4 bg-white/20 text-white border-white/30">
                Assessment Results
              </Badge>
              <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Your Career Assessment Status
              </h1>
              <p className="text-lg text-primary-foreground/80">
                Track your interview progress and discover next steps
              </p>
            </div>
          </div>
        </section>

        {/* Assessment Pipeline */}
        <section className="py-10 border-b bg-card">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-heading text-xl font-bold text-foreground mb-6 text-center">
                Assessment Pipeline
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {[
                  { label: "Applied", status: "done" },
                  { label: "Interview Assessment", status: "done" },
                  { label: "Round 1 — Technical", status: "done" },
                  { label: "Round 2 — Programming", status: "done" },
                  { label: "Round 3 — HR", status: "done" },
                  { label: "Assessment Completed", status: "done" },
                  { label: "Result Processing", status: status === "waiting" ? "current" : "done" },
                ].map((step, idx) => (
                  <div key={step.label} className="text-center">
                    <div
                      className={`h-10 w-10 rounded-full mx-auto mb-2 flex items-center justify-center text-sm font-bold ${
                        step.status === "done"
                          ? "bg-green-500 text-white"
                          : step.status === "current"
                          ? "bg-primary text-primary-foreground animate-pulse"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {step.status === "done" ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        idx + 1
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground font-medium">{step.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Status-specific content */}
        <section className="py-12 lg:py-16">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              {/* Shortlisted */}
              {status === "shortlisted" && (
                <div className="space-y-8">
                  <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8 text-center">
                    <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="h-10 w-10 text-green-600" />
                    </div>
                    <h2 className="font-heading text-3xl font-bold text-green-800 mb-3">
                      🎉 Congratulations! You've Been Shortlisted!
                    </h2>
                    <p className="text-green-700 text-lg mb-6 max-w-xl mx-auto">
                      You have successfully cleared all interview rounds. Our recruitment team will contact you within 48 hours.
                    </p>
                    <Badge className="bg-green-100 text-green-800 border-green-300 text-sm px-4 py-1.5">
                      <Mail className="h-4 w-4 mr-2" />
                      Congratulations email has been sent to your registered email
                    </Badge>
                  </div>

                  {/* Next Steps */}
                  <div className="bg-card rounded-2xl border shadow-card p-8">
                    <h3 className="font-heading text-2xl font-bold text-foreground mb-6">
                      📋 What Happens Next?
                    </h3>
                    <div className="space-y-4">
                      {[
                        { step: 1, title: "Recruitment Team Contact", desc: "Our HR team will reach out via phone/email within 48 hours to discuss your role and joining details." },
                        { step: 2, title: "Offer Letter", desc: "Upon confirmation, you'll receive a digital offer letter with salary details, joining date, and location." },
                        { step: 3, title: "Document Verification", desc: "Submit your educational certificates, ID proof, and other required documents for verification." },
                        { step: 4, title: "Onboarding", desc: "Complete the onboarding process, receive your company credentials, and start your journey with AADHYRA!" },
                      ].map((item) => (
                        <div key={item.step} className="flex items-start gap-4 bg-muted/30 rounded-xl p-4 border">
                          <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm flex-shrink-0">
                            {item.step}
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground">{item.title}</h4>
                            <p className="text-sm text-muted-foreground">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 justify-center">
                    <Link to="/dashboard">
                      <Button variant="hero" size="lg" className="gap-2">
                        Go to Dashboard <ArrowRight className="h-5 w-5" />
                      </Button>
                    </Link>
                    <Link to="/contact">
                      <Button variant="outline" size="lg" className="gap-2">
                        <Phone className="h-4 w-4" /> Contact HR Team
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              {/* Waiting / Not Selected — Show Internship Recommendations */}
              {(status === "waiting" || status === "not_selected") && (
                <div className="space-y-8">
                  {status === "not_selected" && (
                    <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-8 text-center">
                      <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                        <Clock className="h-8 w-8 text-amber-600" />
                      </div>
                      <h2 className="font-heading text-2xl font-bold text-amber-800 mb-3">
                        Thank You for Completing the Assessment
                      </h2>
                      <p className="text-amber-700 max-w-xl mx-auto">
                        While you weren't selected for this position, we encourage you to explore our internship programs to build your skills and try again.
                      </p>
                    </div>
                  )}

                  {status === "waiting" && (
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-8 text-center">
                      <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                        <Clock className="h-8 w-8 text-blue-600 animate-pulse" />
                      </div>
                      <h2 className="font-heading text-2xl font-bold text-blue-800 mb-3">
                        Your Results Are Being Processed
                      </h2>
                      <p className="text-blue-700 max-w-xl mx-auto">
                        Our team is reviewing your assessment. Results will be available within 48 hours.
                        You'll receive an email notification once your results are ready.
                      </p>
                    </div>
                  )}

                  {/* Internship Recommendations */}
                  <div>
                    <div className="text-center mb-8">
                      <Badge variant="outline" className="mb-3 text-primary border-primary/30 bg-primary/5">
                        <Star className="h-3 w-3 mr-1" />
                        Recommended for You
                      </Badge>
                      <h2 className="font-heading text-3xl font-bold text-foreground mb-3">
                        While You Wait — Explore Internships
                      </h2>
                      <p className="text-muted-foreground max-w-xl mx-auto">
                        Build your skills with our industry-recognized internship programs and increase your chances of selection.
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                      {internshipBenefits.map((benefit) => {
                        const Icon = benefit.icon;
                        return (
                          <div
                            key={benefit.title}
                            className="bg-card rounded-xl border shadow-card p-5 hover:shadow-card-hover transition-all group"
                          >
                            <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                              <Icon className="h-5 w-5" />
                            </div>
                            <h4 className="font-semibold text-foreground mb-1">{benefit.title}</h4>
                            <p className="text-sm text-muted-foreground">{benefit.description}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="bg-card rounded-2xl border shadow-card p-8">
                    <h3 className="font-heading text-xl font-bold text-foreground mb-6 text-center">
                      Take the Next Step
                    </h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <Link to="/internships/enroll" className="block">
                        <Button variant="hero" size="lg" className="w-full gap-2 h-auto py-4 flex-col">
                          <GraduationCap className="h-6 w-6" />
                          <span>Join Internship</span>
                        </Button>
                      </Link>
                      <Link to="/apply" className="block">
                        <Button variant="default" size="lg" className="w-full gap-2 h-auto py-4 flex-col">
                          <Zap className="h-6 w-6" />
                          <span>Immediate Joiner</span>
                        </Button>
                      </Link>
                      <Link to="/contact" className="block">
                        <Button variant="outline" size="lg" className="w-full gap-2 h-auto py-4 flex-col">
                          <Users className="h-6 w-6" />
                          <span>Talk to Our Team</span>
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full gap-2 h-auto py-4 flex-col"
                        onClick={() => {
                          // Trigger chatbot open
                          const chatBtn = document.querySelector('[aria-label="Open AI Assistant"]') as HTMLButtonElement;
                          if (chatBtn) chatBtn.click();
                        }}
                      >
                        <Sparkles className="h-6 w-6" />
                        <span>AI Assistant</span>
                      </Button>
                    </div>
                  </div>

                  {/* Additional CTAs */}
                  <div className="flex flex-wrap gap-4 justify-center">
                    <Link to="/courses">
                      <Button variant="outline" size="lg" className="gap-2">
                        <FileText className="h-4 w-4" /> Browse Courses
                      </Button>
                    </Link>
                    <Link to="/student-ambassador">
                      <Button variant="outline" size="lg" className="gap-2">
                        <Target className="h-4 w-4" /> Become an Ambassador
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AssessmentResultsPage;
