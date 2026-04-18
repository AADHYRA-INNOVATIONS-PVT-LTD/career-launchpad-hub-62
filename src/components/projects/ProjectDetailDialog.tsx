import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Code, FileText, Play, Download, ShoppingCart, CheckCircle, Layers, Sparkles, Loader2 } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string | null;
  price: number;
  tech_stack: string[];
  preview_url: string | null;
  project_type: string | null;
  includes: {
    source_code: boolean;
    documentation: boolean;
    ppt: boolean;
    synopsis: boolean;
    demo_video: boolean;
  };
}

interface Props {
  project: Project | null;
  open: boolean;
  onClose: () => void;
  isPurchased: boolean;
  onPurchase: () => void;
  purchasing: boolean;
}

const ProjectDetailDialog = ({ project, open, onClose, isPurchased, onPurchase, purchasing }: Props) => {
  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
              <Code className="h-7 w-7 text-primary" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-2xl">{project.title}</DialogTitle>
              <DialogDescription className="mt-1">
                <Badge variant="outline" className="capitalize mr-2">{project.project_type || "general"}</Badge>
                <span className="text-2xl font-bold text-primary">₹{project.price.toLocaleString()}</span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-2">
          {/* Description */}
          <Card className="p-4 bg-muted/30">
            <h4 className="font-semibold mb-2 flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> About this project</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{project.description}</p>
          </Card>

          {/* Tech Stack */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2"><Layers className="h-4 w-4 text-primary" /> Tech Stack</h4>
            <div className="flex flex-wrap gap-2">
              {project.tech_stack.map((tech, i) => (
                <Badge key={i} variant="secondary">{tech}</Badge>
              ))}
            </div>
          </div>

          {/* What's Included */}
          <div>
            <h4 className="font-semibold mb-3">What's included</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {project.includes.source_code && <IncludeItem icon={<Code className="h-4 w-4" />} label="Source Code" />}
              {project.includes.documentation && <IncludeItem icon={<FileText className="h-4 w-4" />} label="Documentation" />}
              {project.includes.ppt && <IncludeItem icon={<FileText className="h-4 w-4" />} label="Presentation (PPT)" />}
              {project.includes.synopsis && <IncludeItem icon={<FileText className="h-4 w-4" />} label="Synopsis Report" />}
              {project.includes.demo_video && <IncludeItem icon={<Play className="h-4 w-4" />} label="Demo Video" />}
            </div>
          </div>

          {/* Action */}
          <div className="border-t pt-4">
            {isPurchased ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-healthcare">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">You own this project</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  <Button variant="outline" size="sm"><Download className="h-3 w-3 mr-1" /> Code</Button>
                  <Button variant="outline" size="sm"><Download className="h-3 w-3 mr-1" /> Docs</Button>
                  <Button variant="outline" size="sm"><Download className="h-3 w-3 mr-1" /> PPT</Button>
                  <Button variant="outline" size="sm"><Download className="h-3 w-3 mr-1" /> Synopsis</Button>
                  <Button variant="outline" size="sm"><Play className="h-3 w-3 mr-1" /> Demo</Button>
                </div>
              </div>
            ) : (
              <Button size="lg" className="w-full" onClick={onPurchase} disabled={purchasing}>
                {purchasing ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <ShoppingCart className="h-5 w-5 mr-2" />}
                Purchase for ₹{project.price.toLocaleString()}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const IncludeItem = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <div className="flex items-center gap-2 p-2 rounded-md bg-muted/40 text-sm">
    <span className="text-primary">{icon}</span>
    <span>{label}</span>
    <CheckCircle className="h-3 w-3 text-healthcare ml-auto" />
  </div>
);

export default ProjectDetailDialog;
