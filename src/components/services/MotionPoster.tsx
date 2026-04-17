// CSS-driven motion poster used as "AI-generated explainer" preview.
// Lightweight, no copyright issues, looks alive.
const MotionPoster = ({ variant }: { variant: "ai" | "cloud" | "data" | "cyber" | "web" | "crm" | "rsuite" }) => {
  const elements = {
    ai: (
      <>
        <div className="absolute top-1/4 left-1/4 h-32 w-32 rounded-full bg-white/30 blur-2xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 h-40 w-40 rounded-full bg-white/20 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute inset-0 flex items-center justify-center font-heading text-6xl font-black text-white/20 select-none">AI</div>
      </>
    ),
    cloud: (
      <>
        <div className="absolute top-10 left-10 h-24 w-32 rounded-full bg-white/40 blur-xl animate-pulse" />
        <div className="absolute top-20 right-16 h-20 w-28 rounded-full bg-white/30 blur-xl animate-pulse" style={{ animationDelay: "0.5s" }} />
        <div className="absolute bottom-12 left-1/3 h-28 w-40 rounded-full bg-white/35 blur-xl animate-pulse" style={{ animationDelay: "1.2s" }} />
      </>
    ),
    data: (
      <>
        <div className="absolute inset-x-10 bottom-10 flex items-end gap-3 h-32">
          {[60, 90, 45, 75, 55, 100, 70].map((h, i) => (
            <div
              key={i}
              className="flex-1 bg-white/40 rounded-t-lg animate-pulse"
              style={{ height: `${h}%`, animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </>
    ),
    cyber: (
      <>
        <div className="absolute inset-0 grid-pattern opacity-40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-32 w-32 rounded-2xl border-4 border-white/40 animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-48 w-48 rounded-2xl border-2 border-white/20 animate-pulse" style={{ animationDelay: "0.5s" }} />
      </>
    ),
    web: (
      <>
        <div className="absolute top-8 left-8 right-8 h-6 rounded-md bg-white/30" />
        <div className="absolute top-20 left-8 w-1/2 h-24 rounded-lg bg-white/40 animate-pulse" />
        <div className="absolute top-20 right-8 w-1/3 h-24 rounded-lg bg-white/30 animate-pulse" style={{ animationDelay: "0.4s" }} />
        <div className="absolute bottom-8 left-8 right-8 h-16 rounded-lg bg-white/25 animate-pulse" style={{ animationDelay: "0.8s" }} />
      </>
    ),
    crm: (
      <>
        <div className="absolute inset-x-10 top-10 space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3 bg-white/20 rounded-lg p-3 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}>
              <div className="h-8 w-8 rounded-full bg-white/40" />
              <div className="flex-1 h-2 rounded bg-white/40" />
              <div className="h-6 w-16 rounded bg-white/30" />
            </div>
          ))}
        </div>
      </>
    ),
    rsuite: (
      <>
        <div className="absolute inset-0 grid grid-cols-3 gap-3 p-8">
          {["R", "P", "B", "T", "L", "F"].map((l, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white/25 flex items-center justify-center font-heading text-3xl font-black text-white/80 animate-pulse"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              {l}
            </div>
          ))}
        </div>
      </>
    ),
  };

  return <>{elements[variant]}</>;
};

export default MotionPoster;
