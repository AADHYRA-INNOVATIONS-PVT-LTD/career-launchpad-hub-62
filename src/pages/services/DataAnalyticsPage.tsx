import ServicePageLayout from "@/components/services/ServicePageLayout";
import MotionPoster from "@/components/services/MotionPoster";
import { BarChart3, LineChart, PieChart, TrendingUp, Database, Eye } from "lucide-react";

const DataAnalyticsPage = () => (
  <ServicePageLayout
    badge="Data & Analytics"
    title="Turn your data into decisions"
    tagline="Dashboards, BI, and predictive analytics"
    description="Modern data platforms, beautiful dashboards, and AI-driven insights that help business teams act faster and smarter."
    heroGradient="from-emerald-500 to-teal-700"
    videoPosterAnimation={<MotionPoster variant="data" />}
    features={[
      { icon: BarChart3, title: "Analytics Platforms", description: "End-to-end data infrastructure" },
      { icon: LineChart, title: "BI Dashboards", description: "PowerBI, Tableau, Metabase, Looker" },
      { icon: PieChart, title: "Data Visualization", description: "Stunning, interactive charts" },
      { icon: TrendingUp, title: "Predictive Analytics", description: "Forecasts driven by ML models" },
      { icon: Database, title: "Data Warehousing", description: "Snowflake, BigQuery, Redshift" },
      { icon: Eye, title: "Real-time Insights", description: "Streaming dashboards and alerts" },
    ]}
    offerings={[
      "ETL pipelines and data engineering",
      "Self-serve BI dashboards for every team",
      "Custom KPI tracking & alerting",
      "Predictive models for sales & churn",
      "Customer 360 unified views",
      "Embedded analytics in your product",
    ]}
    industries={["Retail", "Finance", "SaaS", "Healthcare", "Logistics"]}
  />
);
export default DataAnalyticsPage;
