import { useState } from "react";
import { PlayCircle, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DemoVideo {
  title: string;
  description: string;
  duration: string;
  category: string;
  thumbnail: string;
  gradient: string;
}

interface DemoVideoSectionProps {
  title?: string;
  subtitle?: string;
  videos: DemoVideo[];
}

const DemoVideoSection = ({ title = "Watch Demo Videos", subtitle = "Get a preview of what you'll learn in our programs", videos }: DemoVideoSectionProps) => {
  const [activeVideo, setActiveVideo] = useState<DemoVideo | null>(null);

  return (
    <>
      <section className="py-10 lg:py-14 bg-muted/30 border-b">
        <div className="container">
          <div className="text-center mb-8">
            <Badge className="bg-primary/10 text-primary border-primary/20 mb-3">🎬 Demo Videos</Badge>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-2">{title}</h2>
            <p className="text-muted-foreground text-sm max-w-2xl mx-auto">{subtitle}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video, idx) => (
              <div
                key={idx}
                className="group bg-card rounded-xl border overflow-hidden hover:shadow-card-hover transition-all cursor-pointer"
                onClick={() => setActiveVideo(video)}
              >
                {/* Thumbnail */}
                <div className={`relative aspect-video ${video.gradient} flex items-center justify-center overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <div className="relative z-10 flex flex-col items-center gap-2">
                    <div className="h-14 w-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <PlayCircle className="h-8 w-8 text-primary" />
                    </div>
                    <span className="text-white text-xs font-medium bg-black/40 rounded-full px-3 py-1">{video.duration}</span>
                  </div>
                  {/* Decorative elements */}
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-white/20 text-white border-white/30 text-xs backdrop-blur-sm">{video.category}</Badge>
                  </div>
                </div>
                {/* Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-sm text-foreground mb-1 group-hover:text-primary transition-colors">{video.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{video.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setActiveVideo(null)}>
          <div className="relative w-full max-w-3xl mx-4 bg-card rounded-2xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
            <div className={`aspect-video ${activeVideo.gradient} flex items-center justify-center`}>
              <div className="text-center text-white p-8">
                <PlayCircle className="h-16 w-16 mx-auto mb-4 opacity-80" />
                <h3 className="text-xl font-bold mb-2">{activeVideo.title}</h3>
                <p className="text-sm text-white/80 max-w-md mx-auto">{activeVideo.description}</p>
                <p className="text-xs text-white/60 mt-4">Demo video • {activeVideo.duration}</p>
              </div>
            </div>
            <div className="p-4 bg-card">
              <Badge className="bg-primary/10 text-primary">{activeVideo.category}</Badge>
              <p className="text-sm text-muted-foreground mt-2">This is a demo preview of the course content. Enroll to access the full training videos.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DemoVideoSection;
