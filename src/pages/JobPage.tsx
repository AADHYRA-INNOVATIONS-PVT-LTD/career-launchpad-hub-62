import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Briefcase, IndianRupee, Users, ArrowRight, Filter, Star, Building2, TrendingUp, Camera, Mail, CheckCircle2, FileText, CreditCard, Video } from "lucide-react";
import { useState } from "react";

const categories = ["All", "IT", "HR", "Digital Marketing", "Graphic Design", "Nursing", "Data Science"];
const jobTypes = ["All Types", "Full-time", "Part-time", "Contract", "Freelance"];

const jobs = [
  { title: "Java Full Stack Developer", company: "TCS", location: "Bangalore", salary: "₹6-12 LPA", experience: "0-2 Years", category: "IT", skills: ["Java", "Spring Boot", "React", "AWS"], applicants: 520, isHot: true, type: "Full-time", posted: "2 days ago", description: "Build enterprise-grade Java applications using Spring Boot, React, and AWS. Work on microservices architecture and RESTful APIs." },
  { title: "Python Developer", company: "Infosys", location: "Hyderabad", salary: "₹5-10 LPA", experience: "0-1 Years", category: "IT", skills: ["Python", "Django", "REST API", "PostgreSQL"], applicants: 380, isHot: true, type: "Full-time", posted: "1 day ago", description: "Develop scalable backend systems using Python and Django. Collaborate with cross-functional teams on REST API design." },
  { title: "HR Executive", company: "Wipro", location: "Pune", salary: "₹3.5-6 LPA", experience: "0-2 Years", category: "HR", skills: ["Recruitment", "Onboarding", "HRMS", "Payroll"], applicants: 290, isHot: false, type: "Full-time", posted: "3 days ago", description: "Manage end-to-end recruitment, onboarding, and HR operations. Handle payroll processing and employee relations." },
  { title: "Digital Marketing Executive", company: "Zoho", location: "Chennai", salary: "₹4-8 LPA", experience: "0-2 Years", category: "Digital Marketing", skills: ["SEO", "Google Ads", "Analytics", "Content"], applicants: 445, isHot: true, type: "Full-time", posted: "1 day ago", description: "Plan and execute digital marketing campaigns across SEO, PPC, and social media channels. Analyze campaign performance." },
  { title: "UI/UX Designer", company: "Freshworks", location: "Bangalore", salary: "₹5-10 LPA", experience: "0-2 Years", category: "Graphic Design", skills: ["Figma", "Adobe XD", "Prototyping", "User Research"], applicants: 210, isHot: false, type: "Full-time", posted: "4 days ago", description: "Design intuitive user interfaces and create interactive prototypes. Conduct user research and usability testing." },
  { title: "Staff Nurse", company: "Apollo Hospitals", location: "Bangalore", salary: "₹3-5 LPA", experience: "0-1 Years", category: "Nursing", skills: ["Patient Care", "ICU", "Emergency", "Documentation"], applicants: 180, isHot: false, type: "Full-time", posted: "2 days ago", description: "Provide patient care in hospital settings. Handle emergency situations, ICU monitoring, and medical documentation." },
  { title: "Data Analyst", company: "Accenture", location: "Mumbai", salary: "₹5-9 LPA", experience: "0-2 Years", category: "Data Science", skills: ["SQL", "Python", "Tableau", "Excel"], applicants: 340, isHot: true, type: "Full-time", posted: "3 days ago", description: "Analyze business data using SQL and Python. Create dashboards and reports with Tableau for decision-making." },
  { title: "AI/ML Engineer", company: "Amazon", location: "Hyderabad", salary: "₹12-25 LPA", experience: "1-3 Years", category: "IT", skills: ["Python", "TensorFlow", "NLP", "Deep Learning"], applicants: 620, isHot: true, type: "Full-time", posted: "1 day ago", description: "Build and deploy ML models for production. Work on NLP, computer vision, and recommendation systems." },
  { title: "Talent Acquisition Specialist", company: "Deloitte", location: "Bangalore", salary: "₹4-8 LPA", experience: "0-2 Years", category: "HR", skills: ["LinkedIn Recruiting", "ATS", "Sourcing", "Interviewing"], applicants: 175, isHot: false, type: "Full-time", posted: "5 days ago", description: "Source and recruit top talent using LinkedIn and ATS platforms. Conduct initial screening and coordinate interviews." },
  { title: "Social Media Manager", company: "Swiggy", location: "Bangalore", salary: "₹6-10 LPA", experience: "1-3 Years", category: "Digital Marketing", skills: ["Instagram", "Meta Ads", "Content Strategy", "Analytics"], applicants: 310, isHot: false, type: "Full-time", posted: "2 days ago", description: "Manage social media presence across platforms. Create content strategies and run paid advertising campaigns." },
];

const hiringSteps = [
  { step: 1, title: "Select Role", description: "Browse jobs, select a role and read the full job description", icon: Briefcase, color: "bg-primary/10 text-primary" },
  { step: 2, title: "Pay Evaluation Fee", description: "Fresher: ₹300 | Experienced: ₹700 — one-time assessment fee", icon: CreditCard, color: "bg-accent/10 text-accent-foreground" },
  { step: 3, title: "Registration Form", description: "Complete your profile with personal & professional details", icon: FileText, color: "bg-primary/10 text-primary" },
  { step: 4, title: "MCQ Test", description: "Domain-specific multiple choice questions with webcam proctoring", icon: CheckCircle2, color: "bg-primary/10 text-primary" },
  { step: 5, title: "Technical Round", description: "Coding/practical assessment based on your domain expertise", icon: Video, color: "bg-primary/10 text-primary" },
  { step: 6, title: "AI HR Interview", description: "AI-powered HR round with webcam & voice analysis", icon: Camera, color: "bg-primary/10 text-primary" },
];

const JobPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedJob, setSelectedJob] = useState<typeof jobs[0] | null>(null);

  const filtered = jobs.filter((j) => {
    const catMatch = selectedCategory === "All" || j.category === selectedCategory;
    const typeMatch = selectedType === "All Types" || j.type === selectedType;
    return catMatch && typeMatch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="gradient-hero text-primary-foreground py-12 lg:py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <Badge className="bg-accent/20 text-accent-foreground border-accent/30 mb-4">💼 {jobs.length}+ jobs available</Badge>
              <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Find Your Dream Job
              </h1>
              <p className="text-lg text-primary-foreground/80">
                Browse curated job opportunities from top companies. Get placed through Shiksha Nex's hiring network.
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-b bg-card">
          <div className="container py-4">
            <div className="flex flex-wrap justify-center gap-8 text-sm">
              <div className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" /><span className="font-semibold text-foreground">5,000+</span><span className="text-muted-foreground">placements done</span></div>
              <div className="flex items-center gap-2"><Building2 className="h-4 w-4 text-primary" /><span className="font-semibold text-foreground">500+</span><span className="text-muted-foreground">hiring partners</span></div>
              <div className="flex items-center gap-2"><Star className="h-4 w-4 text-accent" /><span className="font-semibold text-foreground">₹8 LPA</span><span className="text-muted-foreground">avg. salary</span></div>
            </div>
          </div>
        </section>

        {/* Hiring Process */}
        <section className="py-10 bg-muted/30 border-b">
          <div className="container">
            <div className="text-center mb-8">
              <h2 className="font-heading text-2xl font-bold text-foreground mb-2">How Our Hiring Process Works</h2>
              <p className="text-muted-foreground text-sm">Every step includes email updates • All tests require webcam proctoring</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {hiringSteps.map((s) => (
                <div key={s.step} className="relative bg-card rounded-xl border p-4 text-center hover:border-primary/50 transition-colors">
                  <div className={`h-10 w-10 rounded-full ${s.color} flex items-center justify-center mx-auto mb-3`}>
                    <s.icon className="h-5 w-5" />
                  </div>
                  <Badge variant="outline" className="mb-2 text-xs">Step {s.step}</Badge>
                  <h3 className="font-semibold text-sm text-foreground mb-1">{s.title}</h3>
                  <p className="text-xs text-muted-foreground">{s.description}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5 bg-card rounded-full border px-3 py-1.5">
                <Camera className="h-3.5 w-3.5 text-primary" />
                <span>Webcam required for all tests</span>
              </div>
              <div className="flex items-center gap-1.5 bg-card rounded-full border px-3 py-1.5">
                <Mail className="h-3.5 w-3.5 text-primary" />
                <span>Email updates at every step</span>
              </div>
              <div className="flex items-center gap-1.5 bg-card rounded-full border px-3 py-1.5">
                <IndianRupee className="h-3.5 w-3.5 text-primary" />
                <span>Fresher: ₹300 | Experienced: ₹700</span>
              </div>
            </div>
          </div>
        </section>

        {/* Filters + Jobs */}
        <section className="py-8 lg:py-12">
          <div className="container">
            <div className="grid lg:grid-cols-[280px_1fr] gap-8">
              {/* Sidebar */}
              <aside className="space-y-6">
                <div className="bg-card rounded-xl border p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Filter className="h-4 w-4 text-primary" />
                    <h3 className="font-heading font-semibold text-foreground">Filters</h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Category</label>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                          <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${selectedCategory === cat ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:border-primary"}`}>
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Job Type</label>
                      <div className="flex flex-wrap gap-2">
                        {jobTypes.map((t) => (
                          <button key={t} onClick={() => setSelectedType(t)} className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${selectedType === t ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:border-primary"}`}>
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Evaluation Fee Info */}
                <div className="bg-primary/5 rounded-xl border border-primary/20 p-5">
                  <h3 className="font-heading font-semibold text-foreground mb-3 text-sm">Evaluation Fee</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Fresher (0-1 yr)</span>
                      <Badge className="bg-primary/10 text-primary font-bold">₹300</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Experienced (1+ yr)</span>
                      <Badge className="bg-primary/10 text-primary font-bold">₹700</Badge>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">One-time fee for assessment & interview access</p>
                </div>
              </aside>

              {/* Job Cards */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-sm text-muted-foreground">{filtered.length} jobs found</p>
                </div>

                <div className="space-y-4">
                  {filtered.map((job, idx) => (
                    <div key={idx} className={`bg-card rounded-xl border shadow-card hover:shadow-card-hover transition-all overflow-hidden ${selectedJob?.title === job.title ? 'border-primary ring-1 ring-primary/20' : ''}`}>
                      <div className="p-5">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h3 className="font-heading font-semibold text-foreground group-hover:text-primary transition-colors">{job.title}</h3>
                              {job.isHot && <Badge className="bg-destructive/10 text-destructive text-xs">🔥 Hot</Badge>}
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{job.company}</p>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{job.location}</span>
                              <span className="flex items-center gap-1"><IndianRupee className="h-3.5 w-3.5" />{job.salary}</span>
                              <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" />{job.experience}</span>
                              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{job.posted}</span>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {job.skills.map((s) => (
                                <span key={s} className="px-2 py-0.5 text-xs rounded-md bg-primary/10 text-primary">{s}</span>
                              ))}
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-2">
                            <span className="text-xs text-muted-foreground flex items-center gap-1"><Users className="h-3 w-3" />{job.applicants} applicants</span>
                            <Button size="sm" variant="outline" onClick={() => setSelectedJob(selectedJob?.title === job.title ? null : job)}>
                              {selectedJob?.title === job.title ? 'Hide Details' : 'View Details'}
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Job Details */}
                      {selectedJob?.title === job.title && (
                        <div className="border-t bg-muted/20 p-5 space-y-4">
                          <div>
                            <h4 className="font-semibold text-sm text-foreground mb-2">Job Description</h4>
                            <p className="text-sm text-muted-foreground">{job.description}</p>
                          </div>

                          <div>
                            <h4 className="font-semibold text-sm text-foreground mb-2">Why Evaluation Fee?</h4>
                            <p className="text-sm text-muted-foreground">
                              The evaluation fee covers AI-proctored assessments (MCQ, Technical & HR rounds) to ensure fair, merit-based hiring. This one-time fee validates your skills and creates your verified profile for all employers on Shiksha Nex.
                            </p>
                          </div>

                          <div className="bg-card rounded-lg border p-4">
                            <h4 className="font-semibold text-sm text-foreground mb-3">Application Process</h4>
                            <div className="grid sm:grid-cols-2 gap-3">
                              {hiringSteps.map((s) => (
                                <div key={s.step} className="flex items-start gap-3">
                                  <div className={`h-7 w-7 rounded-full ${s.color} flex items-center justify-center flex-shrink-0 text-xs font-bold`}>
                                    {s.step}
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-foreground">{s.title}</p>
                                    <p className="text-xs text-muted-foreground">{s.description}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-3">
                            <Link to="/apply">
                              <Button className="gap-2">
                                Apply Now — Pay ₹{job.experience.startsWith("0") ? "300" : "700"} <ArrowRight className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button variant="outline" className="gap-2">
                              <Mail className="h-4 w-4" /> Get Email Alerts
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default JobPage;
