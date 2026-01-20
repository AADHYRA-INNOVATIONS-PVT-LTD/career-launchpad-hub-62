import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Users, Award, CheckCircle2, ArrowRight } from "lucide-react";

const courseCategories = {
  it: {
    title: "IT Training Courses",
    description: "Master the latest technologies and frameworks",
    color: "tech",
    courses: [
      { title: "Java Full Stack", duration: "6 Months", students: "500+", tools: ["Java", "Spring Boot", "React", "MySQL"], features: ["Live Projects", "Internship", "Placement"] },
      { title: "Python Full Stack", duration: "6 Months", students: "450+", tools: ["Python", "Django", "React", "PostgreSQL"], features: ["Live Projects", "Internship", "Placement"] },
      { title: "AI / Machine Learning", duration: "4 Months", students: "300+", tools: ["Python", "TensorFlow", "Scikit-learn", "Pandas"], features: ["Research Projects", "Internship", "Placement"] },
      { title: "Data Analytics", duration: "3 Months", students: "400+", tools: ["Python", "SQL", "Tableau", "Power BI"], features: ["Case Studies", "Internship", "Placement"] },
      { title: "Data Science", duration: "5 Months", students: "350+", tools: ["Python", "R", "ML", "Deep Learning"], features: ["Live Projects", "Internship", "Placement"] },
      { title: "AWS & Cloud Computing", duration: "3 Months", students: "350+", tools: ["AWS", "Azure", "Docker", "Kubernetes"], features: ["Certification Prep", "Internship", "Placement"] },
      { title: "Cyber Security", duration: "4 Months", students: "250+", tools: ["Kali Linux", "Wireshark", "Metasploit"], features: ["Lab Practice", "Internship", "Placement"] },
    ],
  },
  hr: {
    title: "HR Training Programs",
    description: "Build expertise in human resource management",
    color: "hr",
    courses: [
      { title: "HR Generalist", duration: "3 Months", students: "300+", tools: ["SAP HR", "Zoho People", "Excel"], features: ["Practical Training", "Internship", "Placement"] },
      { title: "HR Recruiter (IT & Non-IT)", duration: "2 Months", students: "400+", tools: ["LinkedIn Recruiter", "ATS Systems", "Job Portals"], features: ["Mock Sessions", "Internship", "Placement"] },
      { title: "Payroll & Statutory Compliance", duration: "2 Months", students: "200+", tools: ["Tally", "Payroll Software", "Excel"], features: ["Real Cases", "Internship", "Placement"] },
      { title: "Talent Acquisition", duration: "2 Months", students: "250+", tools: ["Sourcing Tools", "Interview Techniques", "ATS"], features: ["Live Hiring", "Internship", "Placement"] },
      { title: "HR Operations", duration: "2 Months", students: "180+", tools: ["HRMS", "Documentation", "Policies"], features: ["Practical Training", "Internship", "Placement"] },
    ],
  },
  marketing: {
    title: "Digital Marketing Courses",
    description: "Master online marketing and growth strategies",
    color: "marketing",
    courses: [
      { title: "Complete Digital Marketing", duration: "4 Months", students: "500+", tools: ["Google Ads", "Meta Ads", "SEO Tools", "Analytics"], features: ["Live Campaigns", "Internship", "Placement"] },
      { title: "SEO Mastery", duration: "2 Months", students: "350+", tools: ["Ahrefs", "SEMrush", "Google Search Console"], features: ["Website Projects", "Internship", "Placement"] },
      { title: "Social Media Marketing", duration: "2 Months", students: "400+", tools: ["Meta Business", "Buffer", "Canva"], features: ["Brand Projects", "Internship", "Placement"] },
      { title: "Google Ads (PPC)", duration: "1 Month", students: "300+", tools: ["Google Ads", "Analytics", "Tag Manager"], features: ["Live Campaigns", "Certification", "Placement"] },
      { title: "Content Marketing", duration: "2 Months", students: "200+", tools: ["WordPress", "Copywriting", "Email Tools"], features: ["Portfolio Building", "Internship", "Placement"] },
    ],
  },
  design: {
    title: "Graphic Design Courses",
    description: "Unleash your creative potential",
    color: "design",
    courses: [
      { title: "Adobe Photoshop", duration: "2 Months", students: "400+", tools: ["Photoshop", "Lightroom"], features: ["Project Work", "Portfolio", "Placement"] },
      { title: "Adobe Illustrator", duration: "2 Months", students: "350+", tools: ["Illustrator", "InDesign"], features: ["Vector Projects", "Portfolio", "Placement"] },
      { title: "UI/UX Design", duration: "3 Months", students: "250+", tools: ["Figma", "Adobe XD", "Sketch"], features: ["App Design", "Internship", "Placement"] },
      { title: "Branding & Visual Design", duration: "2 Months", students: "200+", tools: ["Full Adobe Suite", "Brand Guidelines"], features: ["Brand Projects", "Portfolio", "Placement"] },
      { title: "CorelDRAW", duration: "1 Month", students: "150+", tools: ["CorelDRAW", "Print Design"], features: ["Print Projects", "Portfolio", "Placement"] },
    ],
  },
  nursing: {
    title: "Nursing Training Programs",
    description: "Advanced healthcare training for nursing professionals",
    color: "healthcare",
    courses: [
      { title: "Advanced Clinical Training", duration: "6 Months", students: "300+", tools: ["Clinical Equipment", "Patient Care", "Documentation"], features: ["Hospital Training", "Internship", "Placement"] },
      { title: "ICU & Emergency Care", duration: "3 Months", students: "250+", tools: ["ICU Equipment", "Emergency Protocols", "Life Support"], features: ["Hands-on Training", "Internship", "Placement"] },
      { title: "Patient Care & Documentation", duration: "2 Months", students: "400+", tools: ["EHR Systems", "Care Protocols", "Communication"], features: ["Practical Sessions", "Internship", "Placement"] },
      { title: "Medical Equipment Handling", duration: "1 Month", students: "200+", tools: ["Medical Devices", "Safety Protocols", "Maintenance"], features: ["Lab Practice", "Certification", "Placement"] },
    ],
  },
};

const CoursesPage = () => {
  const [activeTab, setActiveTab] = useState("it");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="gradient-hero text-primary-foreground py-16 lg:py-20">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Our Training Programs
              </h1>
              <p className="text-lg text-white/80">
                Industry-oriented courses designed to make you job-ready. Choose from IT, HR, Digital Marketing, Graphic Design, and Nursing programs.
              </p>
            </div>
          </div>
        </section>

        {/* Courses Tabs */}
        <section className="py-16 lg:py-20">
          <div className="container">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full flex-wrap h-auto gap-2 bg-muted/50 p-2 rounded-xl mb-12">
                <TabsTrigger value="it" className="flex-1 min-w-[120px] data-[state=active]:bg-tech data-[state=active]:text-tech-foreground">
                  IT Courses
                </TabsTrigger>
                <TabsTrigger value="hr" className="flex-1 min-w-[120px] data-[state=active]:bg-hr data-[state=active]:text-hr-foreground">
                  HR Courses
                </TabsTrigger>
                <TabsTrigger value="marketing" className="flex-1 min-w-[120px] data-[state=active]:bg-marketing data-[state=active]:text-marketing-foreground">
                  Digital Marketing
                </TabsTrigger>
                <TabsTrigger value="design" className="flex-1 min-w-[120px] data-[state=active]:bg-design data-[state=active]:text-design-foreground">
                  Graphic Design
                </TabsTrigger>
                <TabsTrigger value="nursing" className="flex-1 min-w-[120px] data-[state=active]:bg-healthcare data-[state=active]:text-healthcare-foreground">
                  Nursing
                </TabsTrigger>
              </TabsList>

              {Object.entries(courseCategories).map(([key, category]) => (
                <TabsContent key={key} value={key} className="mt-0">
                  <div className="mb-8">
                    <h2 className={`font-heading text-2xl md:text-3xl font-bold text-${category.color} mb-2`}>
                      {category.title}
                    </h2>
                    <p className="text-muted-foreground">{category.description}</p>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {category.courses.map((course) => (
                      <div key={course.title} className="bg-card rounded-xl border shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden">
                        <div className="p-6">
                          <h3 className="font-heading text-lg font-semibold text-foreground mb-4">
                            {course.title}
                          </h3>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                            <div className="flex items-center gap-1.5">
                              <Clock className="h-4 w-4" />
                              <span>{course.duration}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Users className="h-4 w-4" />
                              <span>{course.students}</span>
                            </div>
                          </div>

                          <div className="mb-4">
                            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Tools Covered</div>
                            <div className="flex flex-wrap gap-2">
                              {course.tools.map((tool) => (
                                <span key={tool} className={`px-2 py-1 text-xs rounded-md bg-${category.color}/10 text-${category.color}`}>
                                  {tool}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            {course.features.map((feature) => (
                              <div key={feature} className="flex items-center gap-2 text-sm text-foreground">
                                <CheckCircle2 className={`h-4 w-4 text-${category.color}`} />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="px-6 py-4 bg-muted/30 border-t flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Award className="h-4 w-4" />
                            <span>Certificate</span>
                          </div>
                          <Link to="/apply" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                            Enroll Now <ArrowRight className="h-3 w-3" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="bg-card rounded-2xl border shadow-card p-8 lg:p-12 text-center">
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-4">
                Not Sure Which Course to Choose?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Talk to our career counselor for personalized guidance based on your background and career goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/apply">
                  <Button variant="hero" size="lg">Apply Now</Button>
                </Link>
                <a href="tel:+919876543210">
                  <Button variant="outline" size="lg">Call Counselor</Button>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CoursesPage;
