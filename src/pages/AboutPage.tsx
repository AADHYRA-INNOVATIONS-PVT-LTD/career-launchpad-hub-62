import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Target, Eye, Heart, Award, Users, Building2, GraduationCap, Briefcase } from "lucide-react";

const stats = [
  { icon: GraduationCap, value: "5000+", label: "Students Trained" },
  { icon: Building2, value: "500+", label: "Partner Companies" },
  { icon: Award, value: "95%", label: "Placement Rate" },
  { icon: Briefcase, value: "50+", label: "Hospital Partners" },
];

const values = [
  {
    icon: Target,
    title: "Mission",
    description: "To bridge the gap between education and industry by providing practical, job-ready training programs that transform careers and empower individuals.",
  },
  {
    icon: Eye,
    title: "Vision",
    description: "To become India's leading multi-domain training and placement platform, creating skilled professionals across IT, Healthcare, HR, and Creative industries.",
  },
  {
    icon: Heart,
    title: "Values",
    description: "Excellence in training, integrity in placement support, and commitment to every student's success. We believe in nurturing talent and building futures.",
  },
];

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="gradient-hero text-primary-foreground py-16 lg:py-24">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                About Shiksha Nex Technologies
              </h1>
              <p className="text-lg text-white/80">
                Empowering careers through industry-oriented training in IT, HR, Digital Marketing, Graphic Design & Nursing since 2018.
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 -mt-12 relative z-10">
          <div className="container">
            <div className="bg-card rounded-2xl border shadow-xl p-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="text-center">
                      <div className="w-14 h-14 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                        <Icon className="h-7 w-7 text-primary" />
                      </div>
                      <div className="font-heading text-3xl font-bold text-foreground">{stat.value}</div>
                      <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="py-16 lg:py-20">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-primary font-semibold text-sm uppercase tracking-wider">Our Story</span>
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-3 mb-6">
                  Building Careers, Transforming Lives
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Shiksha Nex Technologies was founded with a simple yet powerful vision: to make quality professional training accessible to everyone and ensure every graduate finds their dream career.
                  </p>
                  <p>
                    Starting with IT training in 2018, we quickly expanded to address the growing demands across multiple industries. Today, we offer comprehensive training programs in IT, HR, Digital Marketing, Graphic Design, and Nursing - making us a one-stop platform for career development.
                  </p>
                  <p>
                    Our success lies in our industry-aligned curriculum, experienced trainers, hands-on internships, and dedicated placement support. We've partnered with over 500 companies and 50+ healthcare institutions to ensure our students get the best career opportunities.
                  </p>
                </div>
                <Link to="/apply" className="inline-block mt-8">
                  <Button variant="hero" size="lg">Join Our Success Story</Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-2xl bg-tech/10 p-6 border border-tech/20">
                    <div className="text-tech font-heading text-4xl font-bold">6+</div>
                    <div className="text-sm text-foreground mt-1">Years of Excellence</div>
                  </div>
                  <div className="rounded-2xl bg-healthcare/10 p-6 border border-healthcare/20">
                    <div className="text-healthcare font-heading text-4xl font-bold">50+</div>
                    <div className="text-sm text-foreground mt-1">Hospital Partners</div>
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="rounded-2xl bg-marketing/10 p-6 border border-marketing/20">
                    <div className="text-marketing font-heading text-4xl font-bold">30+</div>
                    <div className="text-sm text-foreground mt-1">Training Programs</div>
                  </div>
                  <div className="rounded-2xl bg-hr/10 p-6 border border-hr/20">
                    <div className="text-hr font-heading text-4xl font-bold">100+</div>
                    <div className="text-sm text-foreground mt-1">Expert Trainers</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission, Vision, Values */}
        <section className="py-16 lg:py-20 bg-muted/30">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
                What Drives Us
              </h2>
              <p className="text-muted-foreground">
                Our commitment to excellence and student success guides everything we do.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {values.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="bg-card rounded-2xl border shadow-card p-8 text-center">
                    <div className="w-16 h-16 mx-auto rounded-2xl gradient-primary flex items-center justify-center mb-6">
                      <Icon className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <h3 className="font-heading text-xl font-bold text-foreground mb-4">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
