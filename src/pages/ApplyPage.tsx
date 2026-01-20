import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Upload, GraduationCap, Briefcase, HeartHandshake } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const courses = [
  { value: "java-fullstack", label: "Java Full Stack", category: "IT" },
  { value: "python-fullstack", label: "Python Full Stack", category: "IT" },
  { value: "ai-ml", label: "AI / Machine Learning", category: "IT" },
  { value: "data-analytics", label: "Data Analytics", category: "IT" },
  { value: "data-science", label: "Data Science", category: "IT" },
  { value: "aws-cloud", label: "AWS & Cloud Computing", category: "IT" },
  { value: "cyber-security", label: "Cyber Security", category: "IT" },
  { value: "hr-generalist", label: "HR Generalist", category: "HR" },
  { value: "hr-recruiter", label: "HR Recruiter", category: "HR" },
  { value: "payroll-compliance", label: "Payroll & Compliance", category: "HR" },
  { value: "talent-acquisition", label: "Talent Acquisition", category: "HR" },
  { value: "digital-marketing", label: "Complete Digital Marketing", category: "Marketing" },
  { value: "seo", label: "SEO Mastery", category: "Marketing" },
  { value: "smm", label: "Social Media Marketing", category: "Marketing" },
  { value: "google-ads", label: "Google Ads (PPC)", category: "Marketing" },
  { value: "photoshop", label: "Adobe Photoshop", category: "Design" },
  { value: "illustrator", label: "Adobe Illustrator", category: "Design" },
  { value: "ui-ux", label: "UI/UX Design", category: "Design" },
  { value: "branding", label: "Branding & Visual Design", category: "Design" },
  { value: "clinical-training", label: "Advanced Clinical Training", category: "Nursing" },
  { value: "icu-emergency", label: "ICU & Emergency Care", category: "Nursing" },
  { value: "patient-care", label: "Patient Care & Documentation", category: "Nursing" },
];

const qualifications = [
  "10th Pass",
  "12th Pass",
  "Diploma",
  "Bachelor's Degree",
  "Master's Degree",
  "GNM",
  "ANM",
  "B.Sc Nursing",
  "M.Sc Nursing",
  "MBA",
  "BBA",
  "Other",
];

const benefits = [
  { icon: GraduationCap, title: "Industry-Oriented Curriculum", description: "Courses designed with industry experts" },
  { icon: Briefcase, title: "100% Placement Assistance", description: "Dedicated placement support team" },
  { icon: HeartHandshake, title: "Internship Opportunities", description: "Real-world project experience" },
];

const ApplyPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    course: "",
    qualification: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Application Submitted!",
      description: "Our counselor will contact you within 24 hours.",
    });
    
    setFormData({ name: "", phone: "", email: "", course: "", qualification: "", message: "" });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="gradient-hero text-primary-foreground py-16 lg:py-20">
          <div className="container">
            <div className="max-w-2xl">
              <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Apply Now
              </h1>
              <p className="text-lg text-white/80">
                Take the first step towards your dream career. Fill out the form below and our counselor will guide you through the enrollment process.
              </p>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-16 lg:py-20">
          <div className="container">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Form */}
              <div className="lg:col-span-2">
                <div className="bg-card rounded-2xl border shadow-card p-8">
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-6">
                    Enrollment Form
                  </h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+91 98765 43210"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Course Interested *</Label>
                        <Select value={formData.course} onValueChange={(value) => setFormData({ ...formData, course: value })} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a course" />
                          </SelectTrigger>
                          <SelectContent>
                            {courses.map((course) => (
                              <SelectItem key={course.value} value={course.value}>
                                {course.label} ({course.category})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Qualification *</Label>
                        <Select value={formData.qualification} onValueChange={(value) => setFormData({ ...formData, qualification: value })} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select qualification" />
                          </SelectTrigger>
                          <SelectContent>
                            {qualifications.map((qual) => (
                              <SelectItem key={qual} value={qual}>
                                {qual}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="resume">Upload Resume (Optional)</Label>
                      <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Drag & drop your resume or <span className="text-primary font-medium">browse</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">PDF, DOC up to 5MB</p>
                        <input type="file" className="hidden" accept=".pdf,.doc,.docx" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Additional Message (Optional)</Label>
                      <Textarea
                        id="message"
                        placeholder="Any specific questions or requirements..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={4}
                      />
                    </div>
                    
                    <Button type="submit" variant="hero" size="xl" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Submitting..." : "Submit Application"}
                    </Button>
                  </form>
                </div>
              </div>
              
              {/* Sidebar */}
              <div className="space-y-6">
                {/* Benefits */}
                <div className="bg-card rounded-2xl border shadow-card p-6">
                  <h3 className="font-heading font-semibold text-lg text-foreground mb-4">
                    Why Choose Us?
                  </h3>
                  <div className="space-y-4">
                    {benefits.map((benefit) => {
                      const Icon = benefit.icon;
                      return (
                        <div key={benefit.title} className="flex gap-4">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground">{benefit.title}</h4>
                            <p className="text-sm text-muted-foreground">{benefit.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Contact Card */}
                <div className="bg-primary/5 rounded-2xl border border-primary/20 p-6">
                  <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                    Need Help?
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Talk to our career counselor for personalized guidance.
                  </p>
                  <a href="tel:+919876543210">
                    <Button variant="outline" className="w-full">
                      Call: +91 98765 43210
                    </Button>
                  </a>
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

export default ApplyPage;
