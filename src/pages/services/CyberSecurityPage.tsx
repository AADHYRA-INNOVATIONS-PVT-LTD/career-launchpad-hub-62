import ServicePageLayout from "@/components/services/ServicePageLayout";
import MotionPoster from "@/components/services/MotionPoster";
import { Shield, Lock, Eye, AlertTriangle, KeyRound, Network } from "lucide-react";

const CyberSecurityPage = () => (
  <ServicePageLayout
    badge="Cyber Security"
    title="Defend your business against modern threats"
    tagline="Audits · Monitoring · Incident response"
    description="Protect data, infrastructure, and customers with hardened security architecture, continuous monitoring, and rapid incident response."
    heroGradient="from-rose-500 to-red-700"
    videoPosterAnimation={<MotionPoster variant="cyber" />}
    features={[
      { icon: Shield, title: "Security Solutions", description: "End-to-end security architecture" },
      { icon: Network, title: "Network Security", description: "Firewalls, IDS/IPS, segmentation" },
      { icon: Lock, title: "Data Protection", description: "Encryption, DLP, access controls" },
      { icon: Eye, title: "Security Monitoring", description: "24/7 SOC and SIEM" },
      { icon: AlertTriangle, title: "Incident Response", description: "Forensics and rapid containment" },
      { icon: KeyRound, title: "IAM & Zero Trust", description: "Modern identity and access" },
    ]}
    offerings={[
      "Vulnerability assessment and pentesting",
      "ISO 27001, SOC 2, GDPR, HIPAA compliance",
      "Web app and API security testing",
      "Cloud security hardening",
      "Endpoint protection (EDR)",
      "Security awareness training",
    ]}
    industries={["Banking", "Healthcare", "Govt", "SaaS", "E-commerce"]}
  />
);
export default CyberSecurityPage;
