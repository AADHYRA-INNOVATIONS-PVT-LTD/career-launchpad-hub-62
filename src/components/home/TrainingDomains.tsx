import { Link } from "react-router-dom";
import { Monitor, Users, TrendingUp, Palette, Heart } from "lucide-react";

const domains = [
  {
    icon: Monitor,
    title: "IT Training",
    description: "Java, Python, AI/ML, Data Science, Cloud Computing & Cyber Security",
    href: "/courses/it",
    color: "tech",
    bgColor: "bg-tech/10",
    borderColor: "border-tech/20",
    iconColor: "text-tech",
  },
  {
    icon: Users,
    title: "HR Training",
    description: "HR Generalist, Recruiter, Payroll, Talent Acquisition & Operations",
    href: "/courses/hr",
    color: "hr",
    bgColor: "bg-hr/10",
    borderColor: "border-hr/20",
    iconColor: "text-hr",
  },
  {
    icon: TrendingUp,
    title: "Digital Marketing",
    description: "SEO, Social Media, Google Ads, Content Marketing & Analytics",
    href: "/courses/digital-marketing",
    color: "marketing",
    bgColor: "bg-marketing/10",
    borderColor: "border-marketing/20",
    iconColor: "text-marketing",
  },
  {
    icon: Palette,
    title: "Graphic Design",
    description: "Photoshop, Illustrator, CorelDRAW, UI/UX & Branding Design",
    href: "/courses/graphic-design",
    color: "design",
    bgColor: "bg-design/10",
    borderColor: "border-design/20",
    iconColor: "text-design",
  },
  {
    icon: Heart,
    title: "Nursing Training",
    description: "Advanced Clinical, ICU Care, Emergency & Patient Documentation",
    href: "/courses/nursing",
    color: "healthcare",
    bgColor: "bg-healthcare/10",
    borderColor: "border-healthcare/20",
    iconColor: "text-healthcare",
  },
];

const TrainingDomains = () => {
  return (
    <section className="py-20 lg:py-28">
      <div className="container">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Our Verticals</span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
            Training Domains We Offer
          </h2>
          <p className="text-muted-foreground">
            Choose from our diverse range of industry-oriented training programs designed to launch and accelerate your career.
          </p>
        </div>

        {/* Domains Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {domains.map((domain, index) => {
            const Icon = domain.icon;
            return (
              <Link
                key={domain.title}
                to={domain.href}
                className="group relative p-6 rounded-2xl border bg-card shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl ${domain.bgColor} ${domain.borderColor} border flex items-center justify-center mb-5 transition-transform group-hover:scale-110`}>
                  <Icon className={`h-7 w-7 ${domain.iconColor}`} />
                </div>
                
                {/* Content */}
                <h3 className="font-heading font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                  {domain.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {domain.description}
                </p>
                
                {/* Hover Accent */}
                <div className={`absolute inset-x-0 bottom-0 h-1 rounded-b-2xl bg-${domain.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrainingDomains;
