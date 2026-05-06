import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check, Tag, Receipt, ShieldCheck, Wallet, GraduationCap, Stethoscope, Briefcase, Megaphone, Palette, Code2 } from "lucide-react";

type Course = { name: string; duration: string; fee: number; emi?: string; highlight?: boolean };
type Vertical = {
  key: string;
  title: string;
  color: string;
  bg: string;
  icon: any;
  blurb: string;
  courses: Course[];
};

const verticals: Vertical[] = [
  {
    key: "it",
    title: "IT Training",
    color: "text-tech",
    bg: "from-tech/10 to-tech/5 border-tech/20",
    icon: Code2,
    blurb: "Java, Python, AI/ML, Cloud, Cyber Security, Data Analytics",
    courses: [
      { name: "Java Full Stack Developer", duration: "6 Months", fee: 19999, emi: "₹3,333 × 6", highlight: true },
      { name: "Python Full Stack Developer", duration: "6 Months", fee: 19999, emi: "₹3,333 × 6" },
      { name: "AI / Machine Learning", duration: "4 Months", fee: 19999, emi: "₹4,999 × 4", highlight: true },
      { name: "Data Analytics", duration: "3 Months", fee: 19999, emi: "₹6,666 × 3" },
      { name: "AWS & Cloud Computing", duration: "3 Months", fee: 19999, emi: "₹6,666 × 3" },
      { name: "Cyber Security Specialist", duration: "4 Months", fee: 19999, emi: "₹4,999 × 4" },
    ],
  },
  {
    key: "marketing",
    title: "Digital Marketing",
    color: "text-marketing",
    bg: "from-marketing/10 to-marketing/5 border-marketing/20",
    icon: Megaphone,
    blurb: "SEO, SMM, Google Ads, Analytics & Complete Digital Marketing",
    courses: [
      { name: "Complete Digital Marketing", duration: "4 Months", fee: 19999, emi: "₹4,999 × 4", highlight: true },
      { name: "SEO Mastery", duration: "2 Months", fee: 19999, emi: "₹9,999 × 2" },
      { name: "Social Media Marketing", duration: "2 Months", fee: 19999, emi: "₹9,999 × 2" },
      { name: "Google Ads (PPC)", duration: "1 Month", fee: 19999 },
    ],
  },
  {
    key: "design",
    title: "Graphic Design",
    color: "text-design",
    bg: "from-design/10 to-design/5 border-design/20",
    icon: Palette,
    blurb: "Photoshop, Illustrator, UI/UX & Branding Design",
    courses: [
      { name: "UI / UX Design", duration: "3 Months", fee: 19999, emi: "₹6,666 × 3", highlight: true },
      { name: "Adobe Photoshop", duration: "2 Months", fee: 19999, emi: "₹9,999 × 2" },
      { name: "Adobe Illustrator", duration: "2 Months", fee: 19999, emi: "₹9,999 × 2" },
      { name: "Branding & Visual Design", duration: "2 Months", fee: 19999 },
    ],
  },
  {
    key: "hr",
    title: "HR Training",
    color: "text-hr",
    bg: "from-hr/10 to-hr/5 border-hr/20",
    icon: Briefcase,
    blurb: "HR Generalist, Recruiter, Payroll & Talent Acquisition",
    courses: [
      { name: "HR Generalist", duration: "3 Months", fee: 5999, emi: "₹1,999 × 3", highlight: true },
      { name: "HR Recruiter (IT & Non-IT)", duration: "2 Months", fee: 5999, emi: "₹2,999 × 2" },
      { name: "Payroll & Compliance", duration: "2 Months", fee: 5999, emi: "₹2,999 × 2" },
      { name: "Talent Acquisition", duration: "2 Months", fee: 5999, emi: "₹2,999 × 2" },
    ],
  },
  {
    key: "nursing",
    title: "Nursing Training",
    color: "text-healthcare",
    bg: "from-healthcare/10 to-healthcare/5 border-healthcare/20",
    icon: Stethoscope,
    blurb: "Advanced Clinical, ICU, Emergency Care & Patient Documentation",
    courses: [
      { name: "Advanced Clinical Training", duration: "6 Months", fee: 20999, emi: "₹3,499 × 6", highlight: true },
      { name: "ICU & Emergency Care", duration: "3 Months", fee: 20999, emi: "₹6,999 × 3" },
      { name: "Patient Care & Documentation", duration: "2 Months", fee: 20999 },
      { name: "Medical Equipment Handling", duration: "1 Month", fee: 20999 },
    ],
  },
];

const internships = [
  { domain: "IT Internship (Live Projects)", duration: "3 / 6 Months", fee: 4999, color: "text-tech" },
  { domain: "HR Internship (Live Tasks + Stipend)", duration: "2 / 3 Months", fee: 2999, color: "text-hr" },
  { domain: "Digital Marketing Internship", duration: "3 Months", fee: 3999, color: "text-marketing" },
  { domain: "Graphic Design Internship", duration: "3 Months", fee: 3999, color: "text-design" },
  { domain: "Nursing Clinical Internship", duration: "3 / 6 Months", fee: 5999, color: "text-healthcare" },
];

const otherFees = [
  { name: "Course Evaluation Test (one-time)", fee: 499, note: "Refundable on enrollment" },
  { name: "AI Proctored Mock Interview", fee: 499, note: "Per attempt" },
  { name: "Project Marketplace (per project)", fee: 5000, note: "Source code + assets + docs" },
  { name: "Placement Assistance — Fresher", fee: 300, note: "MCQ + interview pipeline" },
  { name: "Placement Assistance — Experienced", fee: 700, note: "Premium hiring track" },
];

const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

const PricingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary via-tech to-accent text-primary-foreground">
          <div className="container py-16 md:py-24 text-center">
            <Badge className="mb-4 bg-white/15 text-white border-white/20">Transparent Pricing</Badge>
            <h1 className="font-heading text-3xl md:text-5xl font-bold mb-4">
              Course & Internship Fees
            </h1>
            <p className="text-base md:text-lg text-white/85 max-w-2xl mx-auto">
              No hidden charges. GST-ready invoices. Easy EMI options on every course.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-sm"><Receipt className="h-4 w-4" /> GST Invoice</span>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-sm"><Wallet className="h-4 w-4" /> Easy EMI</span>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-sm"><ShieldCheck className="h-4 w-4" /> Secure Razorpay</span>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-sm"><GraduationCap className="h-4 w-4" /> Certificate Included</span>
            </div>
          </div>
        </section>

        {/* Course Fees by Vertical */}
        <section className="container py-16 md:py-20">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-3">Course Fee Structure</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">All-inclusive fees with LMS access, live mentor sessions, real projects, internship & placement support.</p>
          </div>

          <div className="space-y-10">
            {verticals.map((v) => {
              const Icon = v.icon;
              return (
                <Card key={v.key} className={`overflow-hidden border bg-gradient-to-br ${v.bg}`}>
                  <CardHeader className="border-b border-border/50">
                    <div className="flex items-center gap-4">
                      <div className={`h-12 w-12 rounded-xl bg-card flex items-center justify-center ${v.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className={`font-heading text-2xl ${v.color}`}>{v.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{v.blurb}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border/40">
                      {v.courses.map((c) => (
                        <div key={c.name} className="bg-card p-5 hover:bg-muted/30 transition-colors relative">
                          {c.highlight && (
                            <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground">Popular</Badge>
                          )}
                          <h3 className="font-semibold text-foreground pr-16">{c.name}</h3>
                          <p className="text-xs text-muted-foreground mt-1">Duration: {c.duration}</p>
                          <div className="mt-3 flex items-baseline gap-2">
                            <span className={`text-2xl font-bold ${v.color}`}>{inr(c.fee)}</span>
                            <span className="text-xs text-muted-foreground">+ 18% GST</span>
                          </div>
                          {c.emi && <p className="text-xs text-muted-foreground mt-1">EMI from {c.emi}</p>}
                          <Link to="/apply" className="block mt-4">
                            <Button size="sm" variant="outline" className="w-full">Enroll Now</Button>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Internship Fees */}
        <section className="bg-muted/30 py-16 md:py-20">
          <div className="container">
            <div className="text-center mb-10">
              <Badge className="mb-3" variant="secondary">Live Project Internships</Badge>
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-3">Internship Enrollment Fees</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Hands-on industry projects with mentor reviews, internship certificate, LOR & stipend opportunities.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
              {internships.map((i) => (
                <Card key={i.domain} className="hover:shadow-card-hover transition-all hover:-translate-y-1">
                  <CardContent className="p-6">
                    <Tag className={`h-6 w-6 mb-3 ${i.color}`} />
                    <h3 className="font-semibold text-foreground mb-1">{i.domain}</h3>
                    <p className="text-xs text-muted-foreground mb-4">Duration: {i.duration}</p>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className={`text-2xl font-bold ${i.color}`}>{inr(i.fee)}</span>
                      <span className="text-xs text-muted-foreground">one-time</span>
                    </div>
                    <ul className="text-xs text-muted-foreground space-y-1.5 mb-4">
                      <li className="flex gap-2"><Check className="h-3.5 w-3.5 text-healthcare" /> Real client / live project</li>
                      <li className="flex gap-2"><Check className="h-3.5 w-3.5 text-healthcare" /> Internship certificate + LOR</li>
                      <li className="flex gap-2"><Check className="h-3.5 w-3.5 text-healthcare" /> Mentor review & feedback</li>
                    </ul>
                    <Link to="/internships/enroll">
                      <Button size="sm" className="w-full">Apply for Internship</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Other Fees */}
        <section className="container py-16 md:py-20">
          <div className="text-center mb-10">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-3">Other Charges</h2>
            <p className="text-muted-foreground">Optional add-ons & assessment fees</p>
          </div>
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-0">
              {otherFees.map((f, idx) => (
                <div key={f.name} className={`flex items-center justify-between p-5 ${idx > 0 ? "border-t border-border" : ""}`}>
                  <div>
                    <h4 className="font-medium text-foreground">{f.name}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{f.note}</p>
                  </div>
                  <span className="text-xl font-bold text-primary">{inr(f.fee)}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* CTA */}
        <section className="container pb-20">
          <div className="rounded-3xl bg-gradient-to-br from-primary to-tech text-primary-foreground p-10 md:p-14 text-center">
            <h2 className="font-heading text-2xl md:text-4xl font-bold mb-4">Ready to start your career journey?</h2>
            <p className="text-white/85 mb-6 max-w-xl mx-auto">Join 5,000+ students already trained, certified and placed across India.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/apply"><Button size="xl" variant="accent">Apply Now</Button></Link>
              <Link to="/contact"><Button size="xl" variant="heroOutline">Talk to Counsellor</Button></Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PricingPage;