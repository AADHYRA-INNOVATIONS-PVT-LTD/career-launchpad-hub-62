import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Briefcase, IndianRupee, Users, ArrowRight, Filter, Star, Building2, TrendingUp, Mail, Camera, CheckCircle2, FileText, CreditCard, Video } from "lucide-react";
import { useState } from "react";
import DemoVideoSection from "@/components/shared/DemoVideoSection";
import ApplyDialog from "@/components/career/ApplyDialog";

import thumbCulture from "@/assets/demo-thumb-company-culture.jpg";
import thumbHiring from "@/assets/demo-thumb-hiring-process.jpg";
import thumbInternship from "@/assets/demo-thumb-internship.jpg";

const careerDemoVideos = [
  { title: "Life at AADHYRA INNOVATIONS PVT LTD", description: "Explore our work culture, team, and growth opportunities", duration: "4:15", category: "Company Culture", thumbnail: thumbCulture, gradient: "bg-gradient-to-br from-blue-600 to-primary" },
  { title: "Our Hiring Process Explained", description: "Step-by-step guide to MCQ, Technical, and AI HR interview rounds", duration: "5:30", category: "Hiring Process", thumbnail: thumbHiring, gradient: "bg-gradient-to-br from-emerald-500 to-teal-700" },
  { title: "Partner Company Placements", description: "How students get placed at TCS, Infosys, and other partner companies", duration: "4:00", category: "Placements", thumbnail: thumbInternship, gradient: "bg-gradient-to-br from-orange-500 to-red-600" },
];

const categories = ["All", "IT", "HR", "Digital Marketing", "Graphic Design", "Nursing", "Data Science"];
const jobTypes = ["All Types", "Full-time", "Part-time", "Contract", "Freelance"];

const jobs = [
  {
    title: "Java Full Stack Developer",
    company: "AADHYRA INNOVATIONS PVT LTD",
    location: "Bangalore / Hybrid",
    salary: "₹4.5 - 12 LPA",
    experience: "0-2 Years",
    category: "IT",
    skills: ["Java", "Spring Boot", "React", "REST API", "SQL", "Git"],
    applicants: 15,
    isHot: false,
    type: "Full-time",
    posted: "Just now",
    description: "Develop and maintain full-stack web applications using Java, Spring Boot, SQL databases and modern frontend technologies. Work with the development team to build reliable APIs, implement user-facing features, troubleshoot issues and deliver maintainable software.\n\nKey responsibilities:\n• Develop backend services using Java and Spring Boot.\n• Build and maintain REST APIs.\n• Implement frontend features using React or the project's approved frontend technology.\n• Design and query relational databases.\n• Write readable, maintainable code and participate in code reviews.\n• Debug issues and test application functionality.\n\nRequired skills:\n• Core Java and object-oriented programming.\n• Spring Boot and REST API development.\n• SQL and relational database fundamentals.\n• HTML, CSS and JavaScript fundamentals.\n• Git and debugging.\n\nQualifications:\n• Bachelor's degree in Computer Science, Information Technology or a related discipline, or equivalent practical skills.\n• Relevant project experience or internship experience is acceptable for entry-level candidates."
  },
  {
    title: "Python Full Stack Developer",
    company: "AADHYRA INNOVATIONS PVT LTD",
    location: "Bangalore / Hybrid",
    salary: "₹4.5 - 12 LPA",
    experience: "0-2 Years",
    category: "IT",
    skills: ["Python", "Django", "FastAPI", "React", "REST API", "SQL"],
    applicants: 12,
    isHot: false,
    type: "Full-time",
    posted: "Just now",
    description: "Develop full-stack applications using Python-based backend technologies, REST APIs, relational databases and modern frontend technologies. Contribute to application design, implementation, testing and maintenance.\n\nKey responsibilities:\n• Develop backend services using Python and an appropriate framework such as Django or FastAPI.\n• Design and maintain REST APIs.\n• Integrate frontend interfaces with backend services.\n• Work with SQL databases and data models.\n• Write unit tests, debug issues and improve application reliability.\n• Collaborate with developers and other stakeholders.\n\nRequired skills:\n• Python programming and object-oriented programming.\n• Django or FastAPI fundamentals.\n• REST APIs and SQL.\n• HTML, CSS and JavaScript fundamentals.\n• Git, testing and debugging.\n\nQualifications:\n• Bachelor's degree in Computer Science, Information Technology or a related discipline, or equivalent practical skills.\n• Relevant projects or internships are acceptable for entry-level candidates."
  },
  {
    title: "Artificial Intelligence Developer",
    company: "AADHYRA INNOVATIONS PVT LTD",
    location: "Bangalore / Remote",
    salary: "₹6 - 12 LPA",
    experience: "0-3 Years",
    category: "IT",
    skills: ["Python", "Machine Learning", "LLMs", "NLP", "AI APIs", "Model Evaluation"],
    applicants: 17,
    isHot: false,
    type: "Full-time",
    posted: "Just now",
    description: "Develop and integrate AI-powered features into software applications. Work with Python, machine learning concepts, AI APIs and language-model-based systems to build useful, reliable and testable solutions.\n\nKey responsibilities:\n• Develop backend services and integrate AI functionality into applications.\n• Work with Python, data processing and model APIs.\n• Implement AI-powered search, text processing or automation features where required.\n• Evaluate output quality, reliability and failure cases.\n• Add input validation, error handling and appropriate logging.\n• Collaborate with frontend and backend developers to deliver AI features.\n\nRequired skills:\n• Python programming.\n• Fundamentals of machine learning and AI.\n• Experience with APIs and data handling.\n• Understanding of model evaluation and testing.\n• Familiarity with NLP or large language models is desirable.\n\nQualifications:\n• Bachelor's degree in Computer Science, AI, Data Science or a related field, or equivalent practical experience.\n• Relevant AI projects, coursework or internships are beneficial."
  },
  {
    title: "Data Science Developer",
    company: "AADHYRA INNOVATIONS PVT LTD",
    location: "Bangalore / Hybrid",
    salary: "₹5.5 - 11 LPA",
    experience: "0-3 Years",
    category: "Data Science",
    skills: ["Python", "Pandas", "NumPy", "Statistics", "Machine Learning", "Scikit-learn"],
    applicants: 11,
    isHot: false,
    type: "Full-time",
    posted: "Just now",
    description: "Analyze datasets and develop data science solutions to support business decisions. Perform data cleaning, exploratory analysis, feature engineering, model development and evaluation as appropriate to project requirements.\n\nKey responsibilities:\n• Collect, clean and preprocess datasets.\n• Conduct exploratory data analysis.\n• Develop and evaluate statistical or machine learning models.\n• Identify meaningful patterns and trends.\n• Document analytical findings and communicate results.\n• Collaborate with engineering and business teams to apply insights.\n\nRequired skills:\n• Python, Pandas and NumPy.\n• Statistics and data analysis.\n• Data cleaning and visualization.\n• Machine learning fundamentals.\n• SQL and clear technical communication.\n\nQualifications:\n• Bachelor's degree in Data Science, Statistics, Computer Science, Mathematics or a related field, or equivalent skills.\n• Academic, personal or internship projects in data analysis or machine learning are acceptable for entry-level candidates."
  },
  {
    title: "Data Analyst",
    company: "AADHYRA INNOVATIONS PVT LTD",
    location: "Bangalore / Hybrid",
    salary: "₹4 - 8 LPA",
    experience: "0-2 Years",
    category: "Data Science",
    skills: ["SQL", "Excel", "Power BI", "Data Visualization", "Statistics", "Python"],
    applicants: 10,
    isHot: false,
    type: "Full-time",
    posted: "Just now",
    description: "Analyze business data, prepare reports and dashboards, monitor key performance indicators and communicate actionable insights to support business decisions.\n\nKey responsibilities:\n• Extract and analyze data using SQL and spreadsheets.\n• Clean and validate data before reporting.\n• Build dashboards and visualizations using an appropriate BI tool.\n• Track business metrics and identify trends or anomalies.\n• Prepare clear reports for stakeholders.\n• Document analytical methods and validate results.\n\nRequired skills:\n• SQL queries and data manipulation.\n• Excel and spreadsheet analysis.\n• Data cleaning and validation.\n• Power BI, Tableau or a comparable visualization tool.\n• Basic statistics and analytical communication.\n\nQualifications:\n• Bachelor's degree in Computer Science, Statistics, Mathematics, Business Analytics or a related discipline, or equivalent practical skills.\n• Relevant analytical projects, coursework or internships are beneficial."
  },
  {
    title: "Embedded Systems Developer",
    company: "AADHYRA INNOVATIONS PVT LTD",
    location: "Bangalore",
    salary: "₹4.5 - 8.5 LPA",
    experience: "0-2 Years",
    category: "IT",
    skills: ["Embedded C/C++", "Microcontrollers", "Firmware", "UART", "SPI", "I2C"],
    applicants: 13,
    isHot: false,
    type: "Full-time",
    posted: "Just now",
    description: "Develop and test embedded software and firmware for microcontroller-based systems. Work with low-level programming, hardware interfaces, communication protocols and debugging tools to build reliable embedded applications.\n\nKey responsibilities:\n• Develop firmware using C or C++.\n• Work with microcontrollers and embedded development environments.\n• Integrate and debug hardware communication interfaces.\n• Test firmware behavior and troubleshoot hardware/software issues.\n• Review timing, memory usage and system reliability.\n• Document implementation and testing results.\n\nRequired skills:\n• C/C++ programming fundamentals.\n• Embedded systems and microcontroller concepts.\n• Familiarity with UART, SPI or I2C.\n• Debugging and basic electronics knowledge.\n• Version control and systematic testing.\n\nQualifications:\n• Bachelor's degree in Electronics, Electrical Engineering, Computer Engineering or a related discipline, or equivalent relevant skills.\n• Embedded projects, lab work or internships are beneficial."
  },
  { title: "Java Full Stack Trainer", company: "AADHYRA INNOVATIONS PVT LTD", location: "Bangalore", salary: "₹4-8 LPA", experience: "1-3 Years", category: "IT", skills: ["Java", "Spring Boot", "React", "Teaching"], applicants: 85, isHot: true, type: "Full-time", posted: "1 day ago", description: "Train students on Java Full Stack Development. Create course content, conduct live sessions, and mentor students through projects and internships." },
  { title: "Python & AI Trainer", company: "AADHYRA INNOVATIONS PVT LTD", location: "Bangalore", salary: "₹5-10 LPA", experience: "1-3 Years", category: "IT", skills: ["Python", "TensorFlow", "ML", "Teaching"], applicants: 62, isHot: true, type: "Full-time", posted: "2 days ago", description: "Teach Python, AI/ML concepts to students. Design curriculum, build projects, and guide students through real-world applications." },
  { title: "HR Training Coordinator", company: "AADHYRA INNOVATIONS PVT LTD", location: "Bangalore", salary: "₹3-5 LPA", experience: "0-2 Years", category: "HR", skills: ["Recruitment", "Training", "HRMS", "Communication"], applicants: 120, isHot: false, type: "Full-time", posted: "3 days ago", description: "Coordinate HR training programs, manage student batches, handle placement coordination and employer relations." },
  { title: "Digital Marketing Executive", company: "AADHYRA INNOVATIONS PVT LTD", location: "Bangalore", salary: "₹3.5-6 LPA", experience: "0-2 Years", category: "Digital Marketing", skills: ["SEO", "Google Ads", "Social Media", "Content"], applicants: 145, isHot: true, type: "Full-time", posted: "1 day ago", description: "Manage Aadhyra Innovations's digital presence. Run campaigns, manage social media, create content, and drive student enrollments." },
  { title: "Graphic Designer", company: "AADHYRA INNOVATIONS PVT LTD", location: "Bangalore", salary: "₹3-5 LPA", experience: "0-2 Years", category: "Graphic Design", skills: ["Photoshop", "Illustrator", "Figma", "Canva"], applicants: 95, isHot: false, type: "Full-time", posted: "4 days ago", description: "Create marketing creatives, course thumbnails, social media posts, and branding materials for Aadhyra Innovations." },
  { title: "Nursing Faculty", company: "AADHYRA HEALTH CONNECT", location: "Bangalore", salary: "₹4-7 LPA", experience: "2-5 Years", category: "Nursing", skills: ["Clinical Training", "ICU", "Patient Care", "Teaching"], applicants: 45, isHot: false, type: "Full-time", posted: "5 days ago", description: "Teach nursing students clinical procedures, hospital management, and patient care. Conduct practical sessions." },
  // { title: "Data Analyst - Partner (TCS)", company: "TCS (via Aadhyra Innovations)", location: "Hyderabad", salary: "₹5-9 LPA", experience: "0-2 Years", category: "Data Science", skills: ["SQL", "Python", "Tableau", "Excel"], applicants: 340, isHot: true, type: "Full-time", posted: "2 days ago", description: "Analyze business data using SQL and Python. Create dashboards and reports. Placed through Aadhyra Innovations hiring network." },
  // { title: "Java Developer - Partner (Infosys)", company: "Infosys (via Aadhyra Innovations)", location: "Bangalore", salary: "₹6-12 LPA", experience: "0-2 Years", category: "IT", skills: ["Java", "Spring Boot", "Microservices", "AWS"], applicants: 420, isHot: true, type: "Full-time", posted: "1 day ago", description: "Build enterprise Java applications. Opportunity through Aadhyra Innovations partner hiring program with Infosys." },
  { title: "Content Creator & Curriculum Designer", company: "AADHYRA INNOVATIONS PVT LTD", location: "Work From Home", salary: "₹2.5-4 LPA", experience: "0-1 Years", category: "Digital Marketing", skills: ["Content Writing", "Curriculum Design", "Video Script", "Research"], applicants: 210, isHot: false, type: "Full-time", posted: "3 days ago", description: "Create course content, write scripts for training videos, design curriculum for new programs." },
  { title: "Student Success Manager", company: "AADHYRA INNOVATIONS PVT LTD", location: "Bangalore", salary: "₹3-5 LPA", experience: "0-2 Years", category: "HR", skills: ["Communication", "CRM", "Counseling", "Follow-up"], applicants: 175, isHot: false, type: "Full-time", posted: "2 days ago", description: "Guide enrolled students through their learning journey. Handle queries, track progress, and ensure completion." },
  { title: "Business Development Executive", company: "AADHYRA INNOVATIONS PVT LTD", location: "Bangalore / Hybrid", salary: "₹3-6 LPA + Incentives", experience: "0-2 Years", category: "Business", skills: ["Sales", "Lead Generation", "Communication", "CRM"], applicants: 230, isHot: true, type: "Full-time", posted: "1 day ago", description: "Drive business growth through client acquisition, lead generation, and partnership development. Attractive incentives on target achievement. Hybrid work mode available." },
  { title: "Business Development Manager", company: "AADHYRA INNOVATIONS PVT LTD", location: "Bangalore / Hybrid", salary: "₹5-12 LPA + Incentives", experience: "2-5 Years", category: "Business", skills: ["Team Management", "Strategy", "B2B Sales", "Negotiation"], applicants: 110, isHot: true, type: "Full-time", posted: "1 day ago", description: "Lead the business development team, build strategic partnerships, manage key accounts, and drive revenue growth. Incentives + career growth to VP-level roles." },
  { title: "Academic Counselor", company: "AADHYRA INNOVATIONS PVT LTD", location: "Bangalore / Hybrid", salary: "₹2.5-5 LPA + Incentives", experience: "0-2 Years", category: "Business", skills: ["Counseling", "Communication", "Education", "CRM"], applicants: 290, isHot: true, type: "Full-time", posted: "2 days ago", description: "Guide prospective students in choosing the right courses and career paths. Handle inbound inquiries, conduct counseling sessions, and drive enrollments. Incentives on each successful enrollment." },
  { title: "Career Counsellor", company: "AADHYRA INNOVATIONS PVT LTD", location: "Bangalore / Work From Home", salary: "₹3-6 LPA + Incentives", experience: "0-3 Years", category: "Business", skills: ["Career Guidance", "Aptitude Assessment", "Mentoring", "Communication"], applicants: 180, isHot: false, type: "Full-time", posted: "3 days ago", description: "Provide career guidance to students and professionals. Conduct aptitude assessments, map career paths, and recommend suitable programs. Great growth opportunities." },
  { title: "Sales Executive", company: "AADHYRA INNOVATIONS PVT LTD", location: "Bangalore / Hybrid", salary: "₹2.5-5 LPA + Incentives", experience: "0-2 Years", category: "Business", skills: ["Sales", "Cold Calling", "CRM", "Target Achievement"], applicants: 350, isHot: true, type: "Full-time", posted: "1 day ago", description: "Drive course enrollments through inside sales and field sales. Attractive incentive structure — top performers earn ₹8-15 LPA. Hybrid work mode with flexible schedule." },
  { title: "Sales Manager", company: "AADHYRA INNOVATIONS PVT LTD", location: "Bangalore", salary: "₹6-15 LPA + Incentives", experience: "3-7 Years", category: "Business", skills: ["Team Leadership", "Sales Strategy", "Revenue Management", "P&L"], applicants: 65, isHot: false, type: "Full-time", posted: "2 days ago", description: "Lead a team of sales executives, set targets, build processes, and drive revenue growth. Direct reporting to VP Sales. Fast-track promotion path." },
  { title: "Sales & Marketing Executive", company: "AADHYRA INNOVATIONS PVT LTD", location: "Bangalore / Hybrid", salary: "₹3-6 LPA + Incentives", experience: "0-3 Years", category: "Business", skills: ["Sales", "Digital Marketing", "Lead Generation", "Social Media"], applicants: 275, isHot: true, type: "Full-time", posted: "1 day ago", description: "Dual role combining sales and marketing — generate leads through digital campaigns and convert them into enrollments. Incentives + marketing budget ownership." },
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
  const [applyJob, setApplyJob] = useState<typeof jobs[0] | null>(null);

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
              <Badge className="bg-accent/20 text-accent-foreground border-accent/30 mb-4">💼 Aadhyra Innovations Careers</Badge>
              <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Career at Aadhyra Innovations
              </h1>
              <p className="text-lg text-primary-foreground/80">
                Join our team or get placed with our partner companies. Build your career with AADHYRA INNOVATIONS PVT LTD.
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

        {/* Demo Videos */}
        <DemoVideoSection
          title="Career at Aadhyra Innovations"
          subtitle="Watch videos about our team, hiring process, and partner placements"
          videos={careerDemoVideos}
        />

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
                              <h3 className="font-heading font-semibold text-foreground">{job.title}</h3>
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
                          <div className="flex flex-col items-start sm:items-end gap-2 w-full sm:w-auto mt-3 sm:mt-0">
                            <span className="text-xs text-muted-foreground flex items-center gap-1"><Users className="h-3 w-3" />{job.applicants} applicants</span>
                            <Button size="sm" variant="outline" className="w-full sm:w-auto" onClick={() => setSelectedJob(selectedJob?.title === job.title ? null : job)}>
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
                            <p className="text-sm text-muted-foreground whitespace-pre-line">{job.description}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm text-foreground mb-2">Why Evaluation Fee?</h4>
                            <p className="text-sm text-muted-foreground">
                              The evaluation fee covers AI-proctored assessments (MCQ, Technical & HR rounds) to ensure fair, merit-based hiring. This one-time fee validates your skills and creates your verified profile for all employers on Aadhyra Innovations.
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

                          <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                            <Button className="w-full sm:w-auto gap-2" onClick={() => setApplyJob(job)}>
                              Apply Now <ArrowRight className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" className="w-full sm:w-auto gap-2">
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

      {/* Apply Dialog */}
      {applyJob && (
        <ApplyDialog
          job={applyJob}
          open={!!applyJob}
          onClose={() => setApplyJob(null)}
        />
      )}
    </div>
  );
};

export default JobPage;
