import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Bell,
  User,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { getDisplayName } from "@/lib/displayName";
import { getRoleHome } from "@/lib/returnTo";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import shikshaLogo from "@/assets/aadhyra-logo.png";

const NOTIFICATIONS_PATH = "/dashboard";

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
    href: "/services/ai",
    items: ["AI Powered Platforms", "Next Generation Tech", "AI Chatbots", "Automation", "Machine Learning"],
  },
  {
    title: "Cloud & Enterprise",
    href: "/services/cloud",
    items: ["Cloud Solutions", "Enterprise Integrations", "SaaS Platforms", "Cloud Migration"],
  },
  {
    title: "Data & Analytics",
    href: "/services/data-analytics",
    items: ["Analytics Platforms", "BI Dashboards", "Data Visualization", "Predictive Analytics"],
  },
  {
    title: "Cyber Security",
    href: "/services/cyber-security",
    items: ["Security Solutions", "Network Security", "Data Protection", "SOC Monitoring"],
  },
  {
    title: "Web & Mobile",
    href: "/services/web-mobile",
    items: ["Website Development", "Web Applications", "iOS & Android Apps", "E-commerce"],
  },
];

const crmCategories = [
  {
    title: "CRM & Sales",
    href: "/services/crm",
    items: ["CRM Software", "Lead Management", "Sales Pipeline", "Mobile CRM App", "Invoice & Quotes"],
  },
  {
    title: "CRM by Industry",
    href: "/services/crm",
    items: ["Real Estate", "Education", "Healthcare", "Automobile", "Banking", "Logistics", "Travel", "Retail"],
  },
  {
    title: "R Product Suite",
    href: "/services/r-suite",
    items: ["R Phone — Cloud IVR", "R Dialer — Auto Dialer", "R Bot — AI Chatbot", "R Forms — Surveys", "R Track", "R Locate"],
  },
];

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileCoursesOpen, setMobileCoursesOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { user, profile, roles, isStudent, loading, signOut, userRole } = useAuth();

  const getDashboardPath = () => {
    if (userRole === 'freelancer') {
      return '/freelancer-dashboard';
    }
    if (userRole === 'patient') {
      return '/patient-dashboard';
    }
    if (userRole === 'doctor') {
      return '/doctor-dashboard';
    }
    return getRoleHome(roles);
  };

  const { data: unreadCount } = useQuery({
    queryKey: ['unread-notifications-count', user?.id],
    queryFn: async () => {
      if (!user) return 0;
      try {
        const { count, error } = await supabase
          .from('notifications')
          .select('*', { count: 'exact', head: true })
          .is('read_at', null);

        if (error) return 0;
        return count ?? 0;
      } catch {
        return 0;
      }
    },
    enabled: !!user,
    retry: false,
  });

  const displayName = getDisplayName(profile, user);
  const initials =
    displayName
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'U';

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinkClass = (path: string) =>
    cn(
      "px-2.5 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap",
      isActive(path) ? "text-primary bg-primary/5" : "text-foreground/80 hover:text-primary hover:bg-primary/5"
    );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container px-3 sm:px-6 md:px-8 flex h-16 items-center gap-2">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0 min-w-0">
          <img src={shikshaLogo} alt="Logo" className="h-8 lg:h-9 w-auto shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] lg:text-[12px] xl:text-sm font-heading font-bold text-slate-900 dark:text-white leading-tight truncate">
              <span className="sm:hidden">AADHYRA</span>
              <span className="hidden sm:inline whitespace-nowrap">AADHYRA INNOVATIONS PVT LTD</span>
            </span>
            <span className="text-[9px] xl:text-[10px] text-slate-500 hidden xl:block mt-0.5">
              Innovating Tomorrow, Today
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-1 flex-1 justify-center">
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
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-primary">IT Services</h4>
                        <Link to="/services" className="text-xs text-primary hover:underline">View all →</Link>
                      </div>
                      <div className="grid grid-cols-3 gap-x-6 gap-y-1">
                        {serviceCategories.map((cat) => (
                          <div key={cat.title} className="mb-3">
                            <Link to={cat.href} className="text-sm font-semibold text-foreground hover:text-primary mb-1 block">
                              {cat.title}
                            </Link>
                            {cat.items.map((item) => (
                              <Link key={item} to={cat.href} className="block text-xs text-muted-foreground py-0.5 hover:text-primary transition-colors">
                                {item}
                              </Link>
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
                            <Link to={cat.href} className="text-sm font-semibold text-foreground hover:text-primary mb-1 block">
                              {cat.title}
                            </Link>
                            {cat.items.map((item) => (
                              <Link key={item} to={cat.href} className="block text-xs text-muted-foreground py-0.5 hover:text-primary transition-colors">
                                {item}
                              </Link>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="border-t border-border pt-3 mt-3 flex items-center justify-between">
                      <Link to="/services" className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1">
                        Browse all services <ChevronRight className="h-4 w-4" />
                      </Link>
                      <Link to="/contact" className="text-sm font-medium text-primary hover:underline">
                        Contact for custom solutions →
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
          <Link to="/student-ambassador" className={navLinkClass("/student-ambassador")}>Ambassador</Link>

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

        {/* CTA / Auth Section */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 md:gap-3 flex-shrink-0 ml-auto">
          {loading ? (
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-20 rounded-md" />
              <Skeleton className="h-9 w-24 rounded-md hidden sm:block" />
            </div>
          ) : user ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Link to="/apply" className="hidden md:block">
                <Button variant="accent" size="sm">
                  Apply Now
                </Button>
              </Link>
              {/* Notification Bell */}
              <Link
                to={NOTIFICATIONS_PATH}
                className="relative p-2 rounded-full hover:bg-muted text-foreground/80 hover:text-foreground transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
                title="Notifications"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                {typeof unreadCount === 'number' && unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </Link>

              {/* User Avatar Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative flex items-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 rounded-full hover:bg-muted min-h-[40px] min-w-[40px]"
                  >
                    <Avatar className="h-8 w-8 border border-border">
                      <AvatarImage
                        src={profile?.avatar_url || undefined}
                        alt={displayName}
                      />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium hidden md:inline-block max-w-[100px] truncate">
                      {displayName}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden md:inline-block" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center gap-2 p-2 border-b border-border">
                    <Avatar className="h-9 w-9 border border-border">
                      <AvatarImage
                        src={profile?.avatar_url || undefined}
                        alt={displayName}
                      />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-0.5 truncate">
                      <p className="text-sm font-medium leading-none truncate">
                        {displayName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link
                      to={getDashboardPath()}
                      className="cursor-pointer flex items-center gap-2"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  {(isStudent || roles.includes('student')) && (
                    <DropdownMenuItem asChild>
                      <Link
                        to="/dashboard/profile"
                        className="cursor-pointer flex items-center gap-2"
                      >
                        <User className="h-4 w-4" />
                        My Profile
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-destructive focus:text-destructive flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Link to="/signup">
                <Button size="sm" className="h-8 px-2.5 text-xs sm:h-9 sm:px-3 sm:text-sm font-medium">
                  Sign up
                </Button>
              </Link>
              <div className="hidden md:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-9 px-3 text-sm">
                      Login
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link to="/login" className="cursor-pointer">
                        Student Login
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/employer/auth" className="cursor-pointer">
                        Employer Login
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="md:hidden">
                <Link to="/login">
                  <Button variant="outline" size="sm" className="h-8 px-2.5 text-xs">
                    Login
                  </Button>
                </Link>
              </div>
            </div>
          )}

          <button
            className="xl:hidden p-2 rounded-md hover:bg-muted min-h-[40px] min-w-[40px] flex items-center justify-center"
            aria-label="Toggle menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="xl:hidden border-t bg-card animate-fade-in max-h-[80vh] overflow-y-auto">
          <nav className="container px-4 sm:px-6 py-4 flex flex-col gap-1">
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
                  <Link key={cat.title} to={cat.href} onClick={() => setIsMobileMenuOpen(false)} className="block">
                    <p className="text-sm font-semibold text-foreground hover:text-primary">{cat.title}</p>
                  </Link>
                ))}
                <p className="text-xs font-bold uppercase tracking-wider text-primary pt-2">CRM & Business</p>
                {crmCategories.map((cat) => (
                  <Link key={cat.title} to={cat.href} onClick={() => setIsMobileMenuOpen(false)} className="block">
                    <p className="text-sm font-semibold text-foreground hover:text-primary">{cat.title}</p>
                  </Link>
                ))}
                <Link to="/services" onClick={() => setIsMobileMenuOpen(false)} className="block text-primary text-sm font-medium pt-2">
                  View all services →
                </Link>
              </div>
            )}

            <Link to="/internships" className="px-4 py-3 rounded-lg hover:bg-muted transition-colors font-medium" onClick={() => setIsMobileMenuOpen(false)}>Internships</Link>
            <Link to="/placement" className="px-4 py-3 rounded-lg hover:bg-muted transition-colors font-medium" onClick={() => setIsMobileMenuOpen(false)}>Placements</Link>
            <Link to="/career" className="px-4 py-3 rounded-lg hover:bg-muted transition-colors font-medium" onClick={() => setIsMobileMenuOpen(false)}>Careers</Link>
            <Link to="/student-ambassador" className="px-4 py-3 rounded-lg hover:bg-muted transition-colors font-medium" onClick={() => setIsMobileMenuOpen(false)}>Ambassador</Link>

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

            {/* Mobile Auth / Profile Section */}
            {loading ? (
              <div className="border-t border-border pt-3 mt-2 px-4 space-y-2">
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            ) : user ? (
              <div className="border-t border-border pt-3 mt-2 flex flex-col gap-1">
                <div className="flex items-center gap-3 px-4 py-2">
                  <Avatar className="h-9 w-9 border border-border">
                    <AvatarImage
                      src={profile?.avatar_url || undefined}
                      alt={displayName}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col truncate">
                    <span className="text-sm font-semibold truncate">{displayName}</span>
                    <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                  </div>
                </div>
                <Link
                  to={NOTIFICATIONS_PATH}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-2.5 rounded-lg hover:bg-muted font-medium text-sm transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Bell className="h-4 w-4" /> Notifications
                  </span>
                  {typeof unreadCount === 'number' && unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold">
                      {unreadCount}
                    </span>
                  )}
                </Link>
                <Link
                  to={getDashboardPath()}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg hover:bg-muted font-medium text-sm transition-colors"
                >
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </Link>
                {(isStudent || roles.includes('student')) && (
                  <Link
                    to="/dashboard/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg hover:bg-muted font-medium text-sm transition-colors"
                  >
                    <User className="h-4 w-4" /> My Profile
                  </Link>
                )}
                <Link
                  to="/apply"
                  className="mt-1"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button variant="accent" className="w-full" size="lg">
                    Apply Now
                  </Button>
                </Link>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg hover:bg-destructive/10 text-destructive font-medium text-sm transition-colors text-left"
                >
                  <LogOut className="h-4 w-4" /> Log out
                </button>
              </div>
            ) : (
              <div className="border-t border-border pt-3 mt-2 flex flex-col gap-2">
                <p className="px-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Login Portal</p>
                <Link
                  to="/login"
                  className="px-4 py-3 rounded-lg bg-primary/10 text-primary font-medium text-sm hover:bg-primary/20 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Student Login
                </Link>
                <Link
                  to="/employer/auth"
                  className="px-4 py-3 rounded-lg hover:bg-muted transition-colors font-medium text-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Employer Login
                </Link>
                <Link
                  to="/signup"
                  className="mt-1"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button className="w-full" size="lg">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
