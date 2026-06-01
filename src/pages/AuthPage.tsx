import React, { useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { 
  GraduationCap, 
  Users, 
  Briefcase, 
  Lock, 
  Mail, 
  ArrowLeft,
  AlertCircle,
  Phone,
  Stethoscope
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext"; 

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth(); 

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Restored state
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState(""); // Restored state
  
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const role = searchParams.get("role") || "student";

  const portalConfig: Record<string, { title: string; subtitle: string; desc: string; icon: React.ComponentType<any>; errorMsg: string }> = {
    student: {
      title: "Student Portal",
      subtitle: "Student Portal",
      desc: "Sign in to access your student portal or create a new account",
      icon: GraduationCap,
      errorMsg: "This email is not registered as a student. Please check your credentials or sign up."
    },
    candidate: {
      title: "Candidate Portal",
      subtitle: "Talent Connect",
      desc: "Sign in to monitor your applications, interviews, and verified skill profiles.",
      icon: Users,
      errorMsg: "No candidate account found with this email on Talent Connect."
    },
    freelancer: {
      title: "Freelancer Portal",
      subtitle: "Tech Partner",
      desc: "Sign in to view active milestones, place bids, and manage project escrow.",
      icon: Briefcase,
      errorMsg: "This email is not registered as a freelancer on Tech Partner."
    },
    patient: {
      title: "Patient Portal",
      subtitle: "Health Connect",
      desc: "Sign in to manage appointments, access medical records, and track health vitals.",
      icon: Users,
      errorMsg: "No patient record found matching this email on Health Connect."
    },
    employer: {
      title: "Employer Portal",
      subtitle: "Recruitment Dashboard",
      desc: "Sign in to post jobs, evaluate candidate profiles, and schedule corporate interviews.",
      icon: Briefcase,
      errorMsg: "Corporate account not found. Please verify your employer registration."
    },
    project_owner: {
      title: "Project Owner Portal",
      subtitle: "Project Management",
      desc: "Sign in to fund escrow contracts, review deliverables, and collaborate with freelancers.",
      icon: Briefcase,
      errorMsg: "No Project Owner profile associated with this email address."
    },
    doctor: {
    title: "Medical Practitioner Portal",
    subtitle: "Health Connect",
    desc: "Sign in to manage patient queues, e-prescriptions, and clinical records.",
    icon: Stethoscope, // Make sure to import Stethoscope from 'lucide-react'
    errorMsg: "No medical practitioner account found with this email."
  },
  };

  const currentPortal = portalConfig[role] || portalConfig.student;
  const IconComponent = currentPortal.icon;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          setError("Passwords do not match.");
          setIsLoading(false);
          return;
        }

        const { error } = await signUp(email, password, name, mobile, role);
        
        if (error) {
          setError(error.message);
          setIsLoading(false);
          return;
        }

        alert(`Account registered successfully for the ${currentPortal.title}! Please sign in.`);
        setIsSignUp(false); 
        setPassword("");
        setConfirmPassword("");
        setIsLoading(false);
        return;

      } else {
        const { error } = await signIn(email, password);

        if (error) {
          if (error.message === 'Invalid login credentials') {
            setError("Incorrect email or password. Please try again.");
          } else {
            setError(error.message);
          }
          setIsLoading(false);
          return;
        }

        // Navigate cleanly to the correct portal board
        if (role === "admin") {
          navigate("/admin", { replace: true });
        } else if (role === "employer" || role === "project_owner") {
          navigate("/employer", { replace: true });
        } else if (role === "freelancer") {
          navigate("/freelancer-dashboard", { replace: true });
        } else if (role === "patient") {
          navigate("/patient-dashboard", { replace: true });
        } else if (role === "doctor") {
          navigate("/doctor-dashboard", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
          <IconComponent className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-heading font-bold text-foreground text-lg leading-tight">Aadhya Innovations</h2>
          {/* RESTORED: This dynamically changes the subtitle underneath the main brand */}
          <p className="text-xs text-primary font-medium tracking-wide">{currentPortal.subtitle}</p>
        </div>
    </div>

      <div className="bg-card border shadow-card rounded-2xl max-w-md w-full p-8 border-t-4 border-t-primary transition-all duration-300">
        <div className="text-center mb-6">
        {/* RESTORED: Changes from "Student Portal", "Candidate Portal", etc. based on URL */}
        <h1 className="font-heading text-2xl font-bold text-foreground mb-1.5 tracking-tight">
          {currentPortal.title}
        </h1>
        <p className="text-sm text-muted-foreground px-2">
          {currentPortal.desc}
        </p>
      </div>

        {error && (
          <Alert variant="destructive" className="mb-5 animate-in fade-in zoom-in-95 duration-200">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Authentication Failed</AlertTitle>
            <AlertDescription className="text-xs">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-2 bg-muted p-1 rounded-lg mb-6 text-sm font-medium">
          <button 
            type="button"
            onClick={() => { setIsSignUp(false); setError(null); }}
            className={`py-2 rounded-md transition-all ${!isSignUp ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
          >
            Login
          </button>
          <button 
            type="button"
            onClick={() => { setIsSignUp(true); setError(null); }}
            className={`py-2 rounded-md transition-all ${isSignUp ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="name" 
                  type="text" 
                  placeholder="John Doe" 
                  className="pl-9" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                id="email" 
                type="email" 
                placeholder={`${role}@example.com`}
                className="pl-9" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
          </div>

          {/* RESTORED: Mobile Input Box (Sign Up Only) */}
          {isSignUp && (
            <div className="space-y-1.5">
              <Label htmlFor="mobile">Mobile (Optional)</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="mobile" 
                  type="tel" 
                  placeholder="+91 9876543210" 
                  className="pl-9" 
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              {!isSignUp && (
                <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                  Forgot Password?
                </Link>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                className="pl-9" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
          </div>

          {/* RESTORED: Confirm Password Input Box (Sign Up Only) */}
          {isSignUp && (
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  placeholder="••••••••" 
                  className="pl-9" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required 
                />
              </div>
            </div>
          )}

          <Button type="submit" className="w-full mt-2 font-medium" disabled={isLoading}>
            {isLoading ? "Processing..." : isSignUp ? "Create Account" : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
};

export default AuthPage;