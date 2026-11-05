import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Linkedin, Instagram, ArrowUp } from "lucide-react";

/* ─── Instant scroll to top helper ────────────────────────── */
const scrollToTop = () => {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
};

/* ─── Official WhatsApp brand icon ───────────────────────── */
const WhatsAppIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.276-.1-.476-.15-.676.15-.2.301-.776.979-.952 1.18-.175.201-.351.226-.652.075-.301-.15-1.27-.468-2.42-1.493-.895-.798-1.5-1.784-1.675-2.085-.175-.301-.019-.464.132-.614.136-.135.301-.351.451-.527.151-.175.201-.3.301-.501.101-.2.05-.376-.025-.526-.075-.15-.676-1.63-1.002-2.233-.25-.6-.5-.5-.676-.511l-.577-.01c-.2 0-.526.075-.802.376-.276.301-1.052 1.028-1.052 2.507 0 1.479 1.077 2.908 1.228 3.109.15.2 2.118 3.235 5.132 4.538.717.31 1.277.495 1.714.634.72.23 1.376.197 1.895.12.578-.087 1.78-.727 2.03-1.43.25-.702.25-1.303.175-1.43-.075-.126-.276-.201-.577-.351zM12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 18.06c-1.5 0-2.97-.4-4.26-1.17l-.31-.18-3.15.83.84-3.08-.2-.32a8.04 8.04 0 0 1-1.23-4.23c0-4.46 3.63-8.09 8.09-8.09 2.16 0 4.19.84 5.72 2.37a8.04 8.04 0 0 1 2.37 5.72c0 4.46-3.63 8.09-8.09 8.09z" />
  </svg>
);

/* ─── Footer link wrapper ───────────────────────────────── */
const FLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(to);
    scrollToTop();
  };

  return (
    <a
      href={to}
      onClick={handleClick}
      className="group relative inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
    >
      {/* animated underline */}
      <span className="absolute -bottom-0.5 left-0 h-px bg-primary w-0 group-hover:w-full transition-all duration-300" />
      {children}
    </a>
  );
};

/* ─── Back to Top button ─────────────────────────────────── */
const BackToTop = () => {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      setVisible(scrollY > 300);
      setProgress(maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  const circumference = 2 * Math.PI * 18; // r=18

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className="group fixed bottom-24 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-background shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl"
    >
      {/* circular progress ring */}
      <svg
        className="absolute inset-0 -rotate-90"
        width="48"
        height="48"
        viewBox="0 0 48 48"
      >
        {/* track */}
        <circle
          cx="24"
          cy="24"
          r="18"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.15"
          strokeWidth="3"
        />
        {/* progress */}
        <circle
          cx="24"
          cy="24"
          r="18"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (progress / 100) * circumference}
          className="transition-all duration-100"
        />
      </svg>
      <ArrowUp className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
    </button>
  );
};

/* ─── Footer ─────────────────────────────────────────────── */
const Footer = () => {
  return (
    <>
      <BackToTop />
      <footer className="bg-foreground text-background">
        <div className="container py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                  <span className="text-lg font-bold text-primary-foreground">SN</span>
                </div>
                <div>
                  <span className="text-lg font-heading font-bold">Aadhyra Innovations</span>
                  <span className="block text-xs text-muted-foreground">Technologies</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                One platform for IT, HR, Digital Marketing &amp; Nursing careers. Industry-oriented training, internships,
                placement, freelancing, healthcare and AI tools — all under one roof.
              </p>
              <div className="flex gap-3">
                {[
                  {
                    Icon: Facebook,
                    label: "Facebook",
                    href: "https://www.facebook.com/share/1Dz4CpqsBq/",
                  },
                  {
                    Icon: WhatsAppIcon,
                    label: "WhatsApp",
                    href: "https://wa.me/message/YQXNNZ2BZ7ZYH1",
                  },
                  {
                    Icon: Linkedin,
                    label: "LinkedIn",
                    href: "https://www.linkedin.com/company/aadhyra-innovations-pvt-ltd/",
                  },
                  {
                    Icon: Instagram,
                    label: "Instagram",
                    href: "https://www.instagram.com/aadhyra.innovations?rpxt=MWs0aGF3ZmR4aDU5YQ==",
                  },
                ].map(({ Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="p-2 rounded-lg bg-background/10 hover:bg-primary hover:scale-110 transition-all duration-200"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>

              <ul className="space-y-3 mt-8">
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    19, Lakshmi Nivas, 5th B Cross<br />Sarakki Main Road, J P Nagar 1st Phase<br />Bangalore - 560078
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                  <a href="tel:+918151974736" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    +91 81519 74736
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                  <a href="mailto:aadhyrainnovations@gmail.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    aadhyrainnovations@gmail.com
                  </a>
                </li>
              </ul>
            </div>

            {/* Platform */}
            <div>
              <h3 className="font-heading font-semibold text-lg mb-4">Platform</h3>
              <ul className="space-y-3">
                {[
                  { to: "/about", label: "About Us" },
                  { to: "/courses", label: "All Courses" },
                  { to: "/internships", label: "Internships" },
                  { to: "/placement", label: "Placement Hub" },
                  { to: "/careers", label: "Careers" },
                  { to: "/student-ambassador", label: "Student Ambassador" },
                  { to: "/contact", label: "Contact" },
                  { to: "/verify", label: "Verify Certificate" },
                ].map((l) => (
                  <li key={l.to}><FLink to={l.to}>{l.label}</FLink></li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="font-heading font-semibold text-lg mb-4">Services</h3>
              <ul className="space-y-3">
                {[
                  { to: "/services", label: "All Services" },
                  { to: "/services/ai", label: "AI & Next-Gen" },
                  { to: "/services/cloud", label: "Cloud Solutions" },
                  { to: "/services/data-analytics", label: "Data & Analytics" },
                  { to: "/services/cyber-security", label: "Cyber Security" },
                  { to: "/services/web-mobile", label: "Web & Mobile" },
                  { to: "/services/crm", label: "CRM Solutions" },
                  { to: "/services/r-suite", label: "R Product Suite" },
                ].map((l) => (
                  <li key={l.to}><FLink to={l.to}>{l.label}</FLink></li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-heading font-semibold text-lg mb-4">Legal</h3>
              <ul className="space-y-3">
                {[
                  { to: "/terms", label: "Terms & Conditions" },
                  { to: "/privacy", label: "Privacy Policy" },
                  { to: "/refund", label: "Refund Policy" },
                  { to: "/cookies", label: "Cookie Policy" },
                  { to: "/disclaimer", label: "Disclaimer" },
                ].map((l) => (
                  <li key={l.to}><FLink to={l.to}>{l.label}</FLink></li>
                ))}
              </ul>

              <h3 className="font-heading font-semibold text-lg mt-8 mb-4">Login</h3>
              <ul className="space-y-3">
                {[
                  { to: "/auth", label: "Employee" },
                  { to: "/employer/auth", label: "Employer / Project Owner" },
                ].map((l) => (
                  <li key={l.to}><FLink to={l.to}>{l.label}</FLink></li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Back to Top banner strip */}
        <div className="border-t border-background/10">
          <button
            onClick={scrollToTop}
            className="w-full group py-3 flex items-center justify-center gap-2 text-xs text-muted-foreground hover:text-primary hover:bg-background/5 transition-all duration-200"
          >
            <ArrowUp className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-1" />
            Back to top
          </button>
        </div>

        {/* Copyright */}
        <div className="border-t border-background/10">
          <div className="container py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} AADHYRA INNOVATIONS PVT LTD. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-6 justify-center">
              {[
                { to: "/terms", label: "Terms" },
                { to: "/privacy", label: "Privacy" },
                { to: "/refund", label: "Refund" },
                { to: "/cookies", label: "Cookies" },
                { to: "/disclaimer", label: "Disclaimer" },
              ].map((l) => (
                <FLink key={l.to} to={l.to}>{l.label}</FLink>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
