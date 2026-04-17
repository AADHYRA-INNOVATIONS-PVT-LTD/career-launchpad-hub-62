import ServicePageLayout from "@/components/services/ServicePageLayout";
import MotionPoster from "@/components/services/MotionPoster";
import { Globe, Smartphone, Monitor, Code, ShoppingCart, Layout } from "lucide-react";

const WebMobilePage = () => (
  <ServicePageLayout
    badge="Website & Mobile App Development"
    title="Beautiful websites and apps that convert"
    tagline="React · Next.js · React Native · Flutter"
    description="From marketing websites to complex SaaS apps and iOS/Android products — we design, build, and ship at agency-grade quality."
    heroGradient="from-indigo-500 to-blue-700"
    videoPosterAnimation={<MotionPoster variant="web" />}
    features={[
      { icon: Globe, title: "Website Development", description: "Marketing, corporate, landing pages" },
      { icon: Layout, title: "Web Applications", description: "SaaS, dashboards, portals" },
      { icon: Smartphone, title: "Mobile App Development", description: "iOS + Android cross-platform" },
      { icon: Monitor, title: "Android Development", description: "Native Kotlin & Java apps" },
      { icon: Code, title: "iOS Development", description: "Native Swift apps" },
      { icon: ShoppingCart, title: "E-commerce", description: "Shopify, custom carts, payments" },
    ]}
    offerings={[
      "UI/UX design and design systems",
      "React, Next.js, Vue, Angular front-end",
      "Node, Python, Go, .NET back-end",
      "React Native and Flutter mobile apps",
      "Progressive Web Apps (PWA)",
      "Maintenance and feature enhancements",
    ]}
    industries={["Startups", "E-commerce", "EdTech", "FinTech", "Healthcare"]}
  />
);
export default WebMobilePage;
