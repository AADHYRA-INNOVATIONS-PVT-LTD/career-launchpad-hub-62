import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Briefcase, MapPin, Clock, ArrowRight, Users, Zap, Heart } from "lucide-react";

const openings = [
  {
    title: "IT Trainer - Java Full Stack",
    department: "Training",
    location: "Bangalore",
    type: "Full-time",
    experience: "3+ years",
  },
  {
    title: "HR Recruiter",
    department: "Human Resources",
    location: "Bangalore",
    type: "Full-time",
    experience: "1-3 years",
  },
  {
    title: "Digital Marketing Executive",
    department: "Marketing",
    location: "Bangalore / Remote",
    type: "Full-time",
    experience: "2+ years",
  },
  {
    title: "Nursing Trainer",
    department: "Healthcare Training",
    location: "Bangalore",
    type: "Full-time",
    experience: "5+ years clinical",
  },
  {
    title: "Career Counselor",
    department: "Student Services",
    location: "Bangalore",
    type: "Full-time",
    experience: "2+ years",
  },
  {
    title: "Graphic Design Trainer",
    department: "Training",
    location: "Bangalore",
    type: "Full-time",
    experience: "3+ years",
  },
];

const benefits = [
  { icon: Zap, title: "Growth Opportunities", description: "Fast-track your career with continuous learning" },
  { icon: Users, title: "Collaborative Culture", description: "Work with passionate educators and professionals" },
  { icon: Heart, title: "Work-Life Balance", description: "Flexible hours and supportive environment" },
];

const CareersPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="gradient-hero text-primary-foreground py-16 lg:py-24">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                Join Our Team
              </h1>
              <p className="text-lg text-white/80 mb-8">
                Be part of a mission to transform careers and empower the next generation of professionals. We're always looking for talented individuals to join our growing team.
              </p>
              <div className="flex justify-center gap-8">
                <div className="text-center">
                  <div className="text-4xl font-heading font-bold">{openings.length}</div>
                  <div className="text-sm text-white/70">Open Positions</div>
                </div>
                <div className="w-px bg-white/20" />
                <div className="text-center">
                  <div className="text-4xl font-heading font-bold">100+</div>
                  <div className="text-sm text-white/70">Team Members</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 lg:py-20">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
                Why Work With Us?
              </h2>
              <p className="text-muted-foreground">
                We believe in creating an environment where you can thrive and make an impact.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <div key={benefit.title} className="bg-card rounded-xl border shadow-card p-8 text-center">
                    <div className="w-14 h-14 mx-auto rounded-xl gradient-primary flex items-center justify-center mb-4">
                      <Icon className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <h3 className="font-heading font-semibold text-lg text-foreground mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Job Openings */}
        <section className="py-16 lg:py-20 bg-muted/30">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
                Current Openings
              </h2>
              <p className="text-muted-foreground">
                Explore our open positions and find the right fit for your career.
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto space-y-4">
              {openings.map((job, index) => (
                <div key={index} className="bg-card rounded-xl border shadow-card p-6 hover:shadow-card-hover transition-all">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Briefcase className="h-5 w-5 text-primary" />
                        <h3 className="font-heading font-semibold text-lg text-foreground">{job.title}</h3>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded">{job.department}</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" /> {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" /> {job.type}
                        </span>
                        <span>Exp: {job.experience}</span>
                      </div>
                    </div>
                    <Link to="/contact">
                      <Button variant="outline" className="group">
                        Apply Now
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <p className="text-muted-foreground mb-4">
                Don't see a role that fits? We're always looking for talented people.
              </p>
              <Link to="/contact">
                <Button variant="hero">Send Open Application</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CareersPage;
