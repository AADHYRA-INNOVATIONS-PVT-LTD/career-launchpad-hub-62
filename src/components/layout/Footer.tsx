import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const Footer = () => {
  return (
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
              One platform for IT, HR, Digital Marketing & Nursing careers. Industry-oriented training, internships,
              placement, freelancing, healthcare and AI tools — all under one roof.
            </p>
            <div className="flex gap-3">
              <a href="#" aria-label="Facebook" className="p-2 rounded-lg bg-background/10 hover:bg-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Twitter" className="p-2 rounded-lg bg-background/10 hover:bg-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" aria-label="LinkedIn" className="p-2 rounded-lg bg-background/10 hover:bg-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a> 
              <a href="#" aria-label="Instagram" className="p-2 rounded-lg bg-background/10 hover:bg-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>

            <ul className="space-y-3 mt-8">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground"> 19, Lakshmi Nivas, 5th B Cross<br />Sarakki Main Road, J P Nagar 1st Phase<br />Bangalore - 560078</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <a href="tel:+918151974736" className="text-sm text-muted-foreground hover:text-primary transition-colors">+91 81519 74736</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                <a href="mailto:aadhyrainnovations@gmail.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">aadhyrainnovations@gmail.com</a>
              </li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Platform</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/courses" className="text-sm text-muted-foreground hover:text-primary transition-colors">All Courses</Link></li>
              <li><Link to="/internships" className="text-sm text-muted-foreground hover:text-primary transition-colors">Internships</Link></li>
              <li><Link to="/placement" className="text-sm text-muted-foreground hover:text-primary transition-colors">Placement Hub</Link></li>
              <li><Link to="/careers" className="text-sm text-muted-foreground hover:text-primary transition-colors">Careers</Link></li>
              <li><Link to="/student-ambassador" className="text-sm text-muted-foreground hover:text-primary transition-colors">Student Ambassador</Link></li>
              <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
              <li><Link to="/verify" className="text-sm text-muted-foreground hover:text-primary transition-colors">Verify Certificate</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Services</h3>
            <ul className="space-y-3">
              <li><Link to="/services" className="text-sm text-muted-foreground hover:text-primary transition-colors">All Services</Link></li>
              <li><Link to="/services/ai" className="text-sm text-muted-foreground hover:text-primary transition-colors">AI & Next-Gen</Link></li>
              <li><Link to="/services/cloud" className="text-sm text-muted-foreground hover:text-primary transition-colors">Cloud Solutions</Link></li>
              <li><Link to="/services/data-analytics" className="text-sm text-muted-foreground hover:text-primary transition-colors">Data & Analytics</Link></li>
              <li><Link to="/services/cyber-security" className="text-sm text-muted-foreground hover:text-primary transition-colors">Cyber Security</Link></li>
              <li><Link to="/services/web-mobile" className="text-sm text-muted-foreground hover:text-primary transition-colors">Web & Mobile</Link></li>
              <li><Link to="/services/crm" className="text-sm text-muted-foreground hover:text-primary transition-colors">CRM Solutions</Link></li>
              <li><Link to="/services/r-suite" className="text-sm text-muted-foreground hover:text-primary transition-colors">R Product Suite</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/refund" className="text-sm text-muted-foreground hover:text-primary transition-colors">Refund Policy</Link></li>
              <li><Link to="/cookies" className="text-sm text-muted-foreground hover:text-primary transition-colors">Cookie Policy</Link></li>
              <li><Link to="/disclaimer" className="text-sm text-muted-foreground hover:text-primary transition-colors">Disclaimer</Link></li>
            </ul>

            <h3 className="font-heading font-semibold text-lg mt-8 mb-4">Login</h3>
            <ul className="space-y-3">
              <li><Link to="/auth" className="text-sm text-muted-foreground hover:text-primary transition-colors">Student / Candidate</Link></li>
              <li><Link to="/employer/auth" className="text-sm text-muted-foreground hover:text-primary transition-colors">Employer / Project Owner</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-background/10">
        <div className="container py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} AADHYRA INNOVATIONS PVT LTD. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-6 justify-center">
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms</Link>
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy</Link>
            <Link to="/refund" className="text-sm text-muted-foreground hover:text-primary transition-colors">Refund</Link>
            <Link to="/cookies" className="text-sm text-muted-foreground hover:text-primary transition-colors">Cookies</Link>
            <Link to="/disclaimer" className="text-sm text-muted-foreground hover:text-primary transition-colors">Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
