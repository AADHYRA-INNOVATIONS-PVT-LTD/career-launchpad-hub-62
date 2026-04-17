import ServicePageLayout from "@/components/services/ServicePageLayout";
import MotionPoster from "@/components/services/MotionPoster";
import { Users, TrendingUp, Phone, FileText, Smartphone, Building2 } from "lucide-react";

const CRMServicesPage = () => (
  <ServicePageLayout
    badge="CRM & Sales Solutions"
    title="CRM that drives sales, not headaches"
    tagline="Industry-specific CRM systems for every business"
    description="Lead capture, sales pipelines, deal tracking, invoicing, and reporting — designed around your industry's workflow."
    heroGradient="from-orange-500 to-amber-700"
    videoPosterAnimation={<MotionPoster variant="crm" />}
    features={[
      { icon: Users, title: "Lead Management", description: "Capture, qualify, and assign leads" },
      { icon: TrendingUp, title: "Sales Pipeline", description: "Visual deal tracking & forecasting" },
      { icon: Phone, title: "Contact Management", description: "Single source of truth for customers" },
      { icon: FileText, title: "Invoice & Quotes", description: "GST-ready invoicing built in" },
      { icon: Smartphone, title: "Mobile CRM App", description: "Sell on the go" },
      { icon: Building2, title: "CRM Integration", description: "WhatsApp, Tally, ERP, payment" },
    ]}
    offerings={[
      "Real Estate CRM",
      "Educational Institute CRM",
      "Healthcare CRM",
      "Automobile CRM",
      "Banking & Financial CRM",
      "Logistics CRM",
      "Travel Agency CRM",
      "SaaS Business CRM",
      "Retail Business CRM",
      "Manufacturing CRM",
    ]}
    industries={["Real Estate", "Education", "Healthcare", "Auto", "Banking", "Logistics", "Travel", "Retail"]}
  />
);
export default CRMServicesPage;
