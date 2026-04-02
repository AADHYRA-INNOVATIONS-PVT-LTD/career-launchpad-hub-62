import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import shikshaLogo from "@/assets/shiksha-nex-logo.png";

const courses = [
  { title: "IT Training", href: "/courses/it", description: "Java, Python, AI/ML, Cloud & more" },
  { title: "HR Training", href: "/courses/hr", description: "HR Generalist, Recruiter, Payroll" },
  { title: "Digital Marketing", href: "/courses/digital-marketing", description: "SEO, SMM, Google Ads, Analytics" },
  { title: "Graphic Design", href: "/courses/graphic-design", description: "Photoshop, Illustrator, UI/UX" },
  { title: "Nursing Training", href: "/courses/nursing", description: "Clinical Training, ICU, Emergency Care" },
  { title: "Degree & Diploma", href: "/courses/degree-diploma", description: "BCA, BBA, MBA, Diploma Programs" },
];

const serviceCategories = [
  {
    title: "AI & Next-Gen Technology",
    items: [
      "AI Powered Platforms",
      "Next Generation Technologies",
      "AI Chatbots",
      "Automation Solutions",
      "Machine Learning Solutions",
    ],
  },
  {
    title: "Cloud & Enterprise Solutions",
    items: [
      "Cloud Based Solutions",
      "Enterprise Integrations",
      "SaaS Platforms",
      "Data Storage & Cloud Migration",
    ],
  },
  {
    title: "Data & Analytics",
    items: [
      "Analytics Platforms",
      "Data Analytics Solutions",
      "Business Intelligence Dashboards",
      "Data Visualization",
    ],
  },
  {
    title: "Cyber Security",
    items: [
      "Cyber Security Solutions",
      "Network Security",
      "Data Protection",
      "Security Monitoring",
    ],
  },
  {
    title: "Web & Mobile Development",
    items: [
      "Website Development",
      "Web Applications",
      "Mobile App Development",
      "Android & iOS Apps",
    ],
  },
];

const crmCategories = [
  {
    title: "CRM & Sales Solutions",
    items: [
      "CRM Software",
      "Lead Management",
      "Sales Management",
      "Contact Management CRM",
      "Project Management CRM",
      "Invoice & Quotations",
      "Mobile CRM App",
    ],
  },
  {
    title: "CRM by Industry",
    items: [
      "Real Estate CRM",
      "Educational Institute CRM",
      "Healthcare CRM",
      "Automobile CRM",
      "Banking & Financial CRM",
      "Logistics CRM",
      "Travel Agency CRM",
      "Retail & Manufacturing CRM",
    ],
  },
  {
    title: "Communication & Automation",
    items: [
      "IVR Support (Cloud IVR)",
      "Auto Dialer",
      "AI Chatbot",
      "WhatsApp Business API",
      "Chatbot Integration",
    ],
  },
  {
    title: "Digital Business Tools",
    items: [
      "Survey Forms",
      "Digital Visiting Cards",
      "Lead Tracking",
      "Location Tracking",
      "Affiliate Program",
    ],
  },
  {
    title: "Product Suite",
    items: [
      "R Phone – Cloud IVR",
      "R Dialer – Auto Dialer",
      "R Bot – AI Chatbot",
      "R Forms – Survey Forms",
      "R Track – Tracking System",
      "R Locate – Location Tracking",
    ],
  },
];

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileCoursesOpen, setMobileCoursesOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinkClass = (path: string) =>
    cn(
      "px-3 py-2 text-sm font-medium rounded-md transition-colors",
      isActive(path) ? "text-primary bg-primary/5" : "text-foreground/80 hover:text-primary hover:bg-primary/5"
    );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={shikshaLogo} alt="Shiksha Nex Technologies" className="h-12 w-auto" />
          <div className="hidden sm:block">
            <span className="text-lg font-heading font-bold text-foreground">Shiksha Nex</span>
            <span className="block text-xs text-muted-foreground">Technologies OPC Pvt Ltd</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-0.5">
          <Link to="/" className={navLinkClass("/")}>Home</Link>
          <Link to="/about" className={navLinkClass("/about")}>About Us</Link>

          {/* Services Mega Menu */}
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm font-medium bg-transparent">
                  Services
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[750px] p-5">
                    {/* IT Services */}
                    <div className="mb-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-3">IT Services</h4>
                      <div className="grid grid-cols-3 gap-x-6 gap-y-1">
                        {serviceCategories.map((cat) => (
                          <div key={cat.title} className="mb-3">
                            <p className="text-sm font-semibold text-foreground mb-1">{cat.title}</p>
                            {cat.items.map((item) => (
                              <p key={item} className="text-xs text-muted-foreground py-0.5 hover:text-primary cursor-pointer transition-colors">
                                {item}
                              </p>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="border-t border-border pt-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-3">CRM & Business Solutions</h4>
                      <div className="grid grid-cols-3 gap-x-6 gap-y-1">
                        {crmCategories.map((cat) => (
                          <div key={cat.title} className="mb-3">
                            <p className="text-sm font-semibold text-foreground mb-1">{cat.title}</p>
                            {cat.items.map((item) => (
                              <p key={item} className="text-xs text-muted-foreground py-0.5 hover:text-primary cursor-pointer transition-colors">
                                {item}
                              </p>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="border-t border-border pt-3 mt-3">
                      <Link to="/contact" className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1">
                        Contact us for custom solutions <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <Link to="/internships" className={navLinkClass("/internships")}>Internships</Link>
          <Link to="/placement" className={navLinkClass("/placement")}>Placements</Link>
          <Link to="/career" className={navLinkClass("/career")}>Careers</Link>

          {/* Courses Dropdown */}
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm font-medium bg-transparent">
                  Courses
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                    {courses.map((course) => (
                      <li key={course.title}>
                        <NavigationMenuLink asChild>
                          <Link
                            to={course.href}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent/10 hover:text-accent focus:bg-accent/10 focus:text-accent"
                          >
                            <div className="text-sm font-medium leading-none">{course.title}</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {course.description}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                    <li className="col-span-2 border-t pt-3">
                      <NavigationMenuLink asChild>
                        <Link to="/courses" className="flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                          View All Courses <ChevronRight className="h-4 w-4" />
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <Link to="/contact" className={navLinkClass("/contact")}>Contact</Link>
        </nav>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
          <Link to="/auth" className="hidden sm:block">
            <Button variant="outline" size="sm">Student Login</Button>
          </Link>
          <Link to="/apply" className="hidden sm:block">
            <Button variant="accent" size="sm">Apply Now</Button>
          </Link>
          <button
            className="lg:hidden p-2 rounded-md hover:bg-muted"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t bg-card animate-fade-in max-h-[80vh] overflow-y-auto">
          <nav className="container py-4 flex flex-col gap-1">
            <Link to="/" className="px-4 py-3 rounded-lg hover:bg-muted transition-colors font-medium" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link to="/about" className="px-4 py-3 rounded-lg hover:bg-muted transition-colors font-medium" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>

            {/* Mobile Services */}
            <button
              className="px-4 py-3 rounded-lg hover:bg-muted transition-colors font-medium flex items-center justify-between"
              onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
            >
              Services
              <ChevronDown className={cn("h-4 w-4 transition-transform", mobileServicesOpen && "rotate-180")} />
            </button>
            {mobileServicesOpen && (
              <div className="ml-4 pl-4 border-l border-border space-y-3 py-2">
                <p className="text-xs font-bold uppercase tracking-wider text-primary">IT Services</p>
                {serviceCategories.map((cat) => (
                  <div key={cat.title}>
                    <p className="text-sm font-semibold text-foreground">{cat.title}</p>
                    {cat.items.map((item) => (
                      <p key={item} className="text-xs text-muted-foreground py-0.5 pl-2">{item}</p>
                    ))}
                  </div>
                ))}
                <p className="text-xs font-bold uppercase tracking-wider text-primary pt-2">CRM & Business</p>
                {crmCategories.map((cat) => (
                  <div key={cat.title}>
                    <p className="text-sm font-semibold text-foreground">{cat.title}</p>
                    {cat.items.map((item) => (
                      <p key={item} className="text-xs text-muted-foreground py-0.5 pl-2">{item}</p>
                    ))}
                  </div>
                ))}
              </div>
            )}

            <Link to="/internships" className="px-4 py-3 rounded-lg hover:bg-muted transition-colors font-medium" onClick={() => setIsMobileMenuOpen(false)}>Internships</Link>
            <Link to="/placement" className="px-4 py-3 rounded-lg hover:bg-muted transition-colors font-medium" onClick={() => setIsMobileMenuOpen(false)}>Placements</Link>
            <Link to="/career" className="px-4 py-3 rounded-lg hover:bg-muted transition-colors font-medium" onClick={() => setIsMobileMenuOpen(false)}>Careers</Link>

            {/* Mobile Courses */}
            <button
              className="px-4 py-3 rounded-lg hover:bg-muted transition-colors font-medium flex items-center justify-between"
              onClick={() => setMobileCoursesOpen(!mobileCoursesOpen)}
            >
              Courses
              <ChevronDown className={cn("h-4 w-4 transition-transform", mobileCoursesOpen && "rotate-180")} />
            </button>
            {mobileCoursesOpen && (
              <div className="ml-4 pl-4 border-l border-border flex flex-col gap-1 py-1">
                {courses.map((course) => (
                  <Link key={course.title} to={course.href} className="px-3 py-2 rounded-md text-sm hover:bg-muted transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                    {course.title}
                  </Link>
                ))}
              </div>
            )}

            <Link to="/contact" className="px-4 py-3 rounded-lg hover:bg-muted transition-colors font-medium" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
            <Link to="/apply" className="mt-2" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="accent" className="w-full" size="lg">Apply Now</Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
