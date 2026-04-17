import ServicePageLayout from "@/components/services/ServicePageLayout";
import MotionPoster from "@/components/services/MotionPoster";
import { Phone, PhoneCall, Bot, ClipboardList, MapPin, CreditCard } from "lucide-react";

const RSuitePage = () => (
  <ServicePageLayout
    badge="R Product Suite"
    title="The R Suite — business automation made simple"
    tagline="6 powerful tools to grow, automate, and scale"
    description="R Phone, R Dialer, R Bot, R Forms, R Track, R Locate — a complete suite for sales, support, surveys, and field operations."
    heroGradient="from-fuchsia-500 to-pink-700"
    videoPosterAnimation={<MotionPoster variant="rsuite" />}
    features={[
      { icon: Phone, title: "R Phone", description: "Cloud IVR — virtual numbers, call routing, recordings" },
      { icon: PhoneCall, title: "R Dialer", description: "Auto Dialer — predictive, progressive & power dialing" },
      { icon: Bot, title: "R Bot", description: "AI Chatbot — web + WhatsApp + voice automation" },
      { icon: ClipboardList, title: "R Forms", description: "Survey & Lead forms with analytics" },
      { icon: CreditCard, title: "R Track", description: "Lead & sales tracking system" },
      { icon: MapPin, title: "R Locate", description: "Field staff location tracking" },
    ]}
    offerings={[
      "Cloud IVR with virtual numbers (R Phone)",
      "Auto Dialer with CRM integration (R Dialer)",
      "AI Chatbot trained on your business (R Bot)",
      "Survey forms with WhatsApp delivery (R Forms)",
      "Lead pipeline tracking (R Track)",
      "Live location tracking for field teams (R Locate)",
      "Digital visiting cards & affiliate program",
    ]}
    industries={["Sales Teams", "Call Centres", "Field Sales", "Education", "Real Estate", "Healthcare"]}
  />
);
export default RSuitePage;
