import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Award,
  Gift,
  Users,
  Megaphone,
  TrendingUp,
  BookOpen,
  Briefcase,
  IndianRupee,
  ArrowRight,
  CheckCircle2,
  Star,
  Zap,
  Share2,
  Target,
  GraduationCap,
  Heart,
  Sparkles,
} from "lucide-react";

const benefits = [
  {
    icon: Award,
    title: "Experience Certificate",
    description: "Get an official AADHYRA INNOVATIONS PVT LTD Ambassador Certificate to boost your resume and LinkedIn profile.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: IndianRupee,
    title: "Incentives & Rewards",
    description: "Earn attractive incentives for every successful referral. Top ambassadors earn ₹5,000 – ₹25,000/month.",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: Gift,
    title: "Cashback & Bonuses",
    description: "Get exclusive cashback on your own course enrollments plus milestone bonuses for consistent performance.",
    color: "bg-healthcare/10 text-healthcare",
  },
  {
    icon: Briefcase,
    title: "Full-time Opportunity",
    description: "Top-performing ambassadors are offered full-time roles at AADHYRA INNOVATIONS PVT LTD with competitive salary.",
    color: "bg-tech/10 text-tech",
  },
  {
    icon: BookOpen,
    title: "Free Course Access",
    description: "Get free access to select AADHYRA courses including AI/ML, Digital Marketing, and HR training programs.",
    color: "bg-design/10 text-design",
  },
  {
    icon: GraduationCap,
    title: "Internship Sponsorship",
    description: "Active ambassadors receive sponsored internship opportunities with AADHYRA's partner companies.",
    color: "bg-hr/10 text-hr",
  },
];

const tasks = [
  {
    step: 1,
    title: "Join AADHYRA Communities",
    description: "Join our WhatsApp, Telegram, and LinkedIn groups. Stay updated with latest programs and announcements.",
    icon: Users,
  },
  {
    step: 2,
    title: "Promote Internship Opportunities",
    description: "Share internship and course opportunities in your college groups, social media, and among friends.",
    icon: Megaphone,
  },
  {
    step: 3,
    title: "Refer Students",
    description: "Refer students for courses, internships, and placement programs. Track your referrals in real-time.",
    icon: Share2,
  },
  {
    step: 4,
    title: "Earn Rewards",
    description: "Get paid for every successful enrollment through your referral link. Monthly payouts via UPI or bank transfer.",
    icon: IndianRupee,
  },
];

const testimonials = [
  {
    name: "Priya Sharma",
    college: "VIT Vellore",
    reward: "₹18,000 earned",
    quote: "Being an AADHYRA Ambassador helped me earn while studying. I referred 12 friends and got a free Python course!",
    avatar: "PS",
  },
  {
    name: "Rahul Kumar",
    college: "SRM Chennai",
    reward: "₹25,000 earned",
    quote: "The ambassador program gave me real marketing experience. I was offered a full-time role after 3 months!",
    avatar: "RK",
  },
  {
    name: "Ananya Reddy",
    college: "RVCE Bangalore",
    reward: "₹15,000 earned",
    quote: "I earned incentives, got a free HR course, and now I'm working as a campus coordinator for AADHYRA.",
    avatar: "AR",
  },
];

const stats = [
  { value: "2,000+", label: "Active Ambassadors" },
  { value: "₹50L+", label: "Rewards Distributed" },
  { value: "500+", label: "Colleges Covered" },
  { value: "85%", label: "Get Full-time Offers" },
];

const StudentAmbassadorPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative gradient-hero text-primary-foreground py-20 lg:py-28 overflow-hidden">
          <div className="absolute inset-0 grid-pattern opacity-20" />
          <div className="container relative">
            <div className="max-w-3xl mx-auto text-center">
              <Badge className="mb-4 bg-white/20 text-white border-white/30 backdrop-blur">
                🎓 Campus Ambassador Program
              </Badge>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Become an AADHYRA{" "}
                <span className="text-accent">Student Ambassador</span>
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/85 mb-8 max-w-2xl mx-auto">
                Represent AADHYRA INNOVATIONS PVT LTD at your campus. Earn incentives, gain experience,
                get free courses, and unlock full-time career opportunities.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/auth?role=student">
                  <Button size="lg" variant="accent" className="gap-2 text-lg px-8 h-14">
                    Apply as Ambassador <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button
                    size="lg"
                    variant="outline"
                    className="gap-2 text-lg px-8 h-14 border-white/30 text-white hover:bg-white/10"
                  >
                    Talk to Our Team
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-b bg-card">
          <div className="container py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="font-heading text-2xl md:text-3xl font-bold text-primary">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 lg:py-20">
          <div className="container">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-3 text-primary border-primary/30 bg-primary/5">
                <Sparkles className="h-3 w-3 mr-1" />
                Ambassador Benefits
              </Badge>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
                Why Become an Ambassador?
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Join our ambassador program and unlock exclusive benefits that accelerate your career growth.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={benefit.title}
                    className="group bg-card rounded-2xl border shadow-card hover:shadow-card-hover transition-all duration-300 p-6"
                  >
                    <div
                      className={`h-12 w-12 rounded-xl ${benefit.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 lg:py-20 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-3 text-primary border-primary/30 bg-primary/5">
                <Target className="h-3 w-3 mr-1" />
                Ambassador Tasks
              </Badge>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
                What Will You Do?
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Follow these 4 simple steps to start earning as an AADHYRA Ambassador.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              {/* Connecting line for desktop */}
              <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2 z-0" />

              {tasks.map((task) => {
                const Icon = task.icon;
                return (
                  <div
                    key={task.step}
                    className="relative z-10 bg-card rounded-2xl border shadow-card p-6 text-center hover:border-primary/50 transition-all"
                  >
                    <div className="h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                      {task.step}
                    </div>
                    <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-heading font-semibold text-foreground mb-2">{task.title}</h3>
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Earning Potential */}
        <section className="py-16 lg:py-20">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge variant="outline" className="mb-3 text-accent border-accent/30 bg-accent/5">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Earning Potential
                </Badge>
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
                  How Much Can You Earn?
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 bg-card rounded-xl border p-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                      <Star className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Per Referral Reward</h4>
                      <p className="text-sm text-muted-foreground">
                        Earn ₹200 – ₹2,000 for each successful course enrollment through your referral link.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 bg-card rounded-xl border p-4">
                    <div className="h-10 w-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center flex-shrink-0">
                      <Zap className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Monthly Top Performer Bonus</h4>
                      <p className="text-sm text-muted-foreground">
                        Top 10 ambassadors receive extra ₹5,000 bonus every month + special recognition.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 bg-card rounded-xl border p-4">
                    <div className="h-10 w-10 rounded-lg bg-healthcare/10 text-healthcare flex items-center justify-center flex-shrink-0">
                      <Gift className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Milestone Rewards</h4>
                      <p className="text-sm text-muted-foreground">
                        Unlock free courses, gadgets, and surprise gifts at 10, 25, 50, and 100 referral milestones.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Earnings Table */}
              <div className="bg-card rounded-2xl border shadow-card overflow-hidden">
                <div className="gradient-hero text-primary-foreground p-6">
                  <h3 className="font-heading text-xl font-bold">Earning Breakdown</h3>
                  <p className="text-sm text-primary-foreground/70 mt-1">
                    Based on average ambassador performance
                  </p>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {[
                      { referrals: "5 referrals/month", earning: "₹1,000 – ₹5,000", level: "Starter" },
                      { referrals: "10 referrals/month", earning: "₹5,000 – ₹12,000", level: "Active" },
                      { referrals: "20 referrals/month", earning: "₹12,000 – ₹25,000", level: "Star" },
                      { referrals: "30+ referrals/month", earning: "₹25,000+", level: "Elite" },
                    ].map((tier) => (
                      <div
                        key={tier.level}
                        className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border"
                      >
                        <div>
                          <Badge variant="outline" className="mb-1 text-xs">
                            {tier.level}
                          </Badge>
                          <p className="text-sm text-muted-foreground">{tier.referrals}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-heading font-bold text-primary text-lg">{tier.earning}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 lg:py-20 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-3 text-primary border-primary/30 bg-primary/5">
                <Heart className="h-3 w-3 mr-1" />
                Ambassador Stories
              </Badge>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
                Hear From Our Ambassadors
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <div key={t.name} className="bg-card rounded-2xl border shadow-card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                      {t.avatar}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{t.name}</h4>
                      <p className="text-xs text-muted-foreground">{t.college}</p>
                    </div>
                    <Badge className="ml-auto bg-healthcare/10 text-healthcare text-xs border-healthcare/20">
                      {t.reward}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground italic">"{t.quote}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Eligibility */}
        <section className="py-16 lg:py-20">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
                  Who Can Apply?
                </h2>
                <p className="text-muted-foreground">
                  We welcome students from all backgrounds. Here's what you need:
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  "Currently enrolled in any college/university",
                  "Active on social media (WhatsApp, Instagram, LinkedIn)",
                  "Good communication skills",
                  "Passionate about helping peers grow",
                  "Self-motivated and goal-oriented",
                  "Minimum commitment of 5 hours/week",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 bg-card rounded-xl border p-4">
                    <CheckCircle2 className="h-5 w-5 text-healthcare flex-shrink-0" />
                    <span className="text-sm text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 lg:py-20 gradient-hero text-primary-foreground">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">
                Ready to Represent AADHYRA at Your Campus?
              </h2>
              <p className="text-lg text-primary-foreground/80 mb-8">
                Join 2,000+ ambassadors earning while they learn. No fees, no risk — just rewards.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/auth?role=student">
                  <Button size="lg" variant="accent" className="gap-2 text-lg px-8 h-14">
                    Apply Now <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/internships">
                  <Button
                    size="lg"
                    variant="outline"
                    className="gap-2 text-lg px-8 h-14 border-white/30 text-white hover:bg-white/10"
                  >
                    Explore Internships
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default StudentAmbassadorPage;
