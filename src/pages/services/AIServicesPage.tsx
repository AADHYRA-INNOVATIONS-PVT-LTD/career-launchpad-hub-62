import ServicePageLayout from "@/components/services/ServicePageLayout";
import MotionPoster from "@/components/services/MotionPoster";
import { Brain, Cpu, MessageSquare, Workflow, Zap, Bot } from "lucide-react";

const AIServicesPage = () => (
  <ServicePageLayout
    badge="AI & Next-Gen Technology"
    title="AI Solutions that grow your business"
    tagline="From AI chatbots to automation — built for your industry"
    description="We design, train, and deploy production-grade AI systems: chatbots, recommendation engines, predictive models, computer vision, and end-to-end workflow automation."
    heroGradient="from-violet-500 to-purple-700"
    videoPosterAnimation={<MotionPoster variant="ai" />}
    features={[
      { icon: Brain, title: "AI-Powered Platforms", description: "Custom AI products tailored to your domain" },
      { icon: Bot, title: "AI Chatbots", description: "GPT-class assistants on web, WhatsApp, and IVR" },
      { icon: Workflow, title: "Automation Solutions", description: "Replace repetitive work with reliable AI workflows" },
      { icon: Cpu, title: "Machine Learning", description: "Predictions, scoring, classification, anomaly detection" },
      { icon: MessageSquare, title: "Conversational AI", description: "Voice + text agents trained on your data" },
      { icon: Zap, title: "Next-Gen Tech", description: "LLMs, RAG, vector search, multimodal AI" },
    ]}
    offerings={[
      "Custom GPT-style chatbots with knowledge base ingestion",
      "AI agent automation across email, CRM, and Slack",
      "Computer vision: defect detection, OCR, face recognition",
      "Predictive analytics and demand forecasting",
      "Voice bots and AI-driven IVR for support centers",
      "Fine-tuned LLMs and on-premise AI deployments",
    ]}
    industries={["Retail", "Banking", "Healthcare", "Education", "Logistics", "SaaS", "Real Estate"]}
  />
);
export default AIServicesPage;
