import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Briefcase, IndianRupee, Users, ArrowRight, Filter, Star, Building2, TrendingUp } from "lucide-react";
import { useState } from "react";

const categories = ["All", "IT", "HR", "Digital Marketing", "Graphic Design", "Nursing", "Data Science"];
const jobTypes = ["All Types", "Full-time", "Part-time", "Contract", "Freelance"];

const jobs = [
  { title: "Java Full Stack Developer", company: "TCS", location: "Bangalore", salary: "₹6-12 LPA", experience: "0-2 Years", category: "IT", skills: ["Java", "Spring Boot", "React", "AWS"], applicants: 520, isHot: true, type: "Full-time", posted: "2 days ago" },
  { title: "Python Developer", company: "Infosys", location: "Hyderabad", salary: "₹5-10 LPA", experience: "0-1 Years", category: "IT", skills: ["Python", "Django", "REST API", "PostgreSQL"], applicants: 380, isHot: true, type: "Full-time", posted: "1 day ago" },
  { title: "HR Executive", company: "Wipro", location: "Pune", salary: "₹3.5-6 LPA", experience: "0-2 Years", category: "HR", skills: ["Recruitment", "Onboarding", "HRMS", "Payroll"], applicants: 290, isHot: false, type: "Full-time", posted: "3 days ago" },
  { title: "Digital Marketing Executive", company: "Zoho", location: "Chennai", salary: "₹4-8 LPA", experience: "0-2 Years", category: "Digital Marketing", skills: ["SEO", "Google Ads", "Analytics", "Content"], applicants: 445, isHot: true, type: "Full-time", posted: "1 day ago" },
  { title: "UI/UX Designer", company: "Freshworks", location: "Bangalore", salary: "₹5-10 LPA", experience: "0-2 Years", category: "Graphic Design", skills: ["Figma", "Adobe XD", "Prototyping", "User Research"], applicants: 210, isHot: false, type: "Full-time", posted: "4 days ago" },
  { title: "Staff Nurse", company: "Apollo Hospitals", location: "Bangalore", salary: "₹3-5 LPA", experience: "0-1 Years", category: "Nursing", skills: ["Patient Care", "ICU", "Emergency", "Documentation"], applicants: 180, isHot: false, type: "Full-time", posted: "2 days ago" },
  { title: "Data Analyst", company: "Accenture", location: "Mumbai", salary: "₹5-9 LPA", experience: "0-2 Years", category: "Data Science", skills: ["SQL", "Python", "Tableau", "Excel"], applicants: 340, isHot: true, type: "Full-time", posted: "3 days ago" },
  { title: "AI/ML Engineer", company: "Amazon", location: "Hyderabad", salary: "₹12-25 LPA", experience: "1-3 Years", category: "IT", skills: ["Python", "TensorFlow", "NLP", "Deep Learning"], applicants: 620, isHot: true, type: "Full-time", posted: "1 day ago" },
  { title: "Talent Acquisition Specialist", company: "Deloitte", location: "Bangalore", salary: "₹4-8 LPA", experience: "0-2 Years", category: "HR", skills: ["LinkedIn Recruiting", "ATS", "Sourcing", "Interviewing"], applicants: 175, isHot: false, type: "Full-time", posted: "5 days ago" },
  { title: "Social Media Manager", company: "Swiggy", location: "Bangalore", salary: "₹6-10 LPA", experience: "1-3 Years", category: "Digital Marketing", skills: ["Instagram", "Meta Ads", "Content Strategy", "Analytics"], applicants: 310, isHot: false, type: "Full-time", posted: "2 days ago" },
];

const JobPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedType, setSelectedType] = useState("All Types");

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
              </aside>

              {/* Job Cards */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-sm text-muted-foreground">{filtered.length} jobs found</p>
                </div>

                <div className="space-y-4">
                  {filtered.map((job, idx) => (
                    <div key={idx} className="bg-card rounded-xl border shadow-card hover:shadow-card-hover transition-all p-5 group">
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
                          <Link to="/apply">
                            <Button size="sm" className="group/btn">
                              Apply Now <ArrowRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
                            </Button>
                          </Link>
                        </div>
                      </div>
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
