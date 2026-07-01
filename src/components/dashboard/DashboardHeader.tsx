import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Menu, User, Bell, Shield, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

interface DashboardHeaderProps {
  title?: string;
  role?: "student" | "freelancer" | "patient" | "doctor" | "employer" | "candidate";
  onMenuToggle: () => void;
}

const DashboardHeader = ({ title, role = "student", onMenuToggle }: DashboardHeaderProps) => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  // Dynamic context sub-label mapping
  const getContextLabel = () => {
    if (title?.toLowerCase().includes("admin")) return "System Administration";
    
    switch (role) {
      case "patient":
        return "Aadhyra Health Connect (Patient)";
      case "doctor":
        return "Aadhyra Health Connect (Medical Personnel)";
      case "freelancer":
        return "Aadhyra Tech Partner (Freelancer)";
      case "employer":
        return "Aadhyra Talent Connect (Employer)";
      case "student":
      default:
        return "Aadhyra Talent Connect (Employee)";
    }
  };

  const handleLogoutAction = async () => {
    try {
      await signOut();
      navigate(`/auth?role=${role}`);
    } catch (err) {
      console.error("Sign out context failure:", err);
    }
  };

  return (
    <header className="h-16 border-b border-border bg-card px-4 lg:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left section: Mobile menu handler + Titles */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden text-muted-foreground"
          onClick={onMenuToggle}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-sm lg:text-base font-heading font-bold text-foreground leading-none">
            {title || "Dashboard Hub"}
          </h2>
          <span className="text-[11px] text-muted-foreground mt-0.5 block">
            {getContextLabel()}
          </span>
        </div>
      </div>

      {/* Right section: System Trays + Profile context control drops */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-muted-foreground relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-2.5 right-2.5 h-1.5 w-1.5 rounded-full bg-destructive" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full bg-muted/60 p-0 border">
              <User className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-foreground truncate">
                  {profile?.full_name || "Account User"}
                </p>
                <p className="text-xs leading-none text-muted-foreground capitalize">
                  {role} portal account
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate(`/dashboard/profile`)}>
              <User className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>My Profile View</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleLogoutAction} 
              className="text-destructive focus:bg-destructive/10 focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardHeader;