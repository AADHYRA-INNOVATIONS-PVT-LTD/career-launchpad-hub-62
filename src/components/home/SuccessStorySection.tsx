import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Briefcase, Award, Sparkles } from "lucide-react";
import journeyImg from "@/assets/home-journey.jpg";
import studentsImg from "@/assets/home-students-learning.jpg";
import jobOfferImg from "@/assets/home-job-offer.jpg";
import hiringImg from "@/assets/home-hiring-partners.jpg";

const SuccessStorySection = () => {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container">
        {/* Headline */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            <Sparkles className="h-4 w-4" /> Real Stories. Real Careers.
          </span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4">
            From <span className="text-destructive">Unemployed</span> to{" "}
            <span className="text-tech">Hired by Top Companies</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            Every month, hundreds of students walk into AADHYRA without direction — and walk out with a job offer in hand.
          </p>
        </div>

        {/* Before / After hero */}
        <div className="rounded-3xl overflow-hidden border shadow-card mb-12 bg-gradient-to-br from-tech/5 to-accent/5">
          <img
            src={journeyImg}
            alt="Student journey from unemployment to job offer"
            loading="lazy"
            width={1280}
            height={720}
            className="w-full h-auto"
          />
          <div className="p-6 md:p-8 grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="font-heading text-2xl font-bold mb-2">The AADHYRA Transformation</h3>
              <p className="text-muted-foreground">
                Train · Build Real Projects · Internship · Mock Interviews · Get Placed. Every step backed by mentors who've been there.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Stat value="5,000+" label="Placed" />
              <Stat value="500+" label="Hiring Partners" />
              <Stat value="95%" label="Success Rate" />
            </div>
          </div>
        </div>

        {/* Three story cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <StoryCard
            image={studentsImg}
            icon={TrendingUp}
            tag="Learn"
            title="Live Mentor-led Training"
            text="Hands-on classes with industry experts across IT, HR, Marketing, Design & Nursing."
            color="text-tech"
          />
          <StoryCard
            image={hiringImg}
            icon={Briefcase}
            tag="Hire"
            title="500+ Hiring Partners"
            text="Direct campus drives, exclusive job openings & employer-verified profiles."
            color="text-marketing"
          />
          <StoryCard
            image={jobOfferImg}
            icon={Award}
            tag="Offer"
            title="Real Job Offers in Hand"
            text="From service-based MNCs to product startups — students get verified job offers."
            color="text-healthcare"
          />
        </div>

        <div className="text-center mt-10">
          <Link to="/placement">
            <Button size="xl" variant="accent" className="group">
              See Placement Stories
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

const Stat = ({ value, label }: { value: string; label: string }) => (
  <div className="text-center bg-card rounded-xl p-3 border">
    <div className="text-xl md:text-2xl font-heading font-bold text-primary">{value}</div>
    <div className="text-[10px] md:text-xs text-muted-foreground mt-1 uppercase tracking-wide">{label}</div>
  </div>
);

const StoryCard = ({ image, icon: Icon, tag, title, text, color }: any) => (
  <div className="group rounded-2xl overflow-hidden bg-card border shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300">
    <div className="relative h-48 overflow-hidden">
      <img src={image} alt={title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-card/90 backdrop-blur text-xs font-bold uppercase tracking-wider">
        <span className={color}>{tag}</span>
      </div>
    </div>
    <div className="p-5">
      <Icon className={`h-6 w-6 mb-2 ${color}`} />
      <h4 className="font-heading font-semibold text-lg mb-1.5">{title}</h4>
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  </div>
);

export default SuccessStorySection;