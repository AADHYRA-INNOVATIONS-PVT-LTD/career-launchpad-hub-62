const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden -z-10 bg-animated-mesh">
      <div className="absolute inset-0 grid-pattern opacity-40" />
      <div className="blob bg-primary/40 w-96 h-96 -top-20 -left-20" style={{ animationDelay: "0s" }} />
      <div className="blob bg-accent/40 w-80 h-80 top-1/3 right-0" style={{ animationDelay: "3s" }} />
      <div className="blob bg-healthcare/40 w-72 h-72 bottom-0 left-1/4" style={{ animationDelay: "6s" }} />
      <div className="blob bg-design/40 w-96 h-96 -bottom-20 right-1/4" style={{ animationDelay: "9s" }} />
    </div>
  );
};

export default AnimatedBackground;
