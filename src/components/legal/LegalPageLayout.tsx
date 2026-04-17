import { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";

interface LegalPageLayoutProps {
  badge: string;
  title: string;
  lastUpdated: string;
  children: ReactNode;
}

const LegalPageLayout = ({ badge, title, lastUpdated, children }: LegalPageLayoutProps) => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main>
      <section className="bg-muted/30 border-b py-12">
        <div className="container">
          <Badge className="mb-3 bg-primary/10 text-primary border-primary/20">{badge}</Badge>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground mt-2">Last updated: {lastUpdated}</p>
        </div>
      </section>
      <section className="py-12">
        <div className="container max-w-3xl">
          <article className="prose prose-slate max-w-none text-foreground [&>h2]:font-heading [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mt-8 [&>h2]:mb-3 [&>h3]:font-heading [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:mt-6 [&>h3]:mb-2 [&>p]:text-muted-foreground [&>p]:mb-4 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-4 [&>ul>li]:text-muted-foreground [&>ul>li]:mb-1">
            {children}
          </article>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default LegalPageLayout;
