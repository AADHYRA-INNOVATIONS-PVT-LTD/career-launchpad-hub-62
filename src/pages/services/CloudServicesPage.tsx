import ServicePageLayout from "@/components/services/ServicePageLayout";
import MotionPoster from "@/components/services/MotionPoster";
import { Cloud, Database, Server, Layers, Shield, Settings } from "lucide-react";

const CloudServicesPage = () => (
  <ServicePageLayout
    badge="Cloud & Enterprise Solutions"
    title="Scalable cloud infrastructure for modern business"
    tagline="AWS · Azure · GCP — design, migrate, optimize"
    description="From SaaS platforms to enterprise integrations and cloud migrations, we help you ship reliable, scalable, cost-optimized infrastructure."
    heroGradient="from-sky-500 to-blue-700"
    videoPosterAnimation={<MotionPoster variant="cloud" />}
    features={[
      { icon: Cloud, title: "Cloud-Based Solutions", description: "Multi-cloud architecture and deployment" },
      { icon: Layers, title: "SaaS Platforms", description: "Multi-tenant apps with billing & analytics" },
      { icon: Database, title: "Cloud Migration", description: "On-prem to cloud with zero downtime" },
      { icon: Server, title: "Enterprise Integrations", description: "ERP, HRMS, CRM, payment gateway connectors" },
      { icon: Shield, title: "Cloud Security", description: "IAM, VPC, encryption, compliance" },
      { icon: Settings, title: "DevOps & CI/CD", description: "Pipelines, monitoring, autoscaling" },
    ]}
    offerings={[
      "AWS / Azure / GCP architecture & deployment",
      "Lift-and-shift and re-platform migrations",
      "Kubernetes, Docker, serverless workloads",
      "ERP & HRMS integrations",
      "Data lake & warehouse setup",
      "24x7 cloud managed services",
    ]}
    industries={["FinTech", "EdTech", "E-commerce", "Manufacturing", "Healthcare"]}
  />
);
export default CloudServicesPage;
