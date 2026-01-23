import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Public Pages
import Index from "./pages/Index";
import AboutPage from "./pages/AboutPage";
import CoursesPage from "./pages/CoursesPage";
import PlacementPage from "./pages/PlacementPage";
import ContactPage from "./pages/ContactPage";
import CareersPage from "./pages/CareersPage";
import ApplyPage from "./pages/ApplyPage";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";

// Dashboard Layout & Pages
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import DashboardCourses from "./pages/dashboard/DashboardCourses";
import DashboardInterview from "./pages/dashboard/DashboardInterview";
import DashboardProfile from "./pages/dashboard/DashboardProfile";
import InterviewRoundPage from "./pages/dashboard/InterviewRoundPage";
import ComingSoon from "./components/dashboard/ComingSoon";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminInterviews from "./pages/admin/AdminInterviews";
import AdminCertificates from "./pages/admin/AdminCertificates";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminSettings from "./pages/admin/AdminSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:category" element={<CoursesPage />} />
            <Route path="/placement" element={<PlacementPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/apply" element={<ApplyPage />} />
            <Route path="/auth" element={<AuthPage />} />

            {/* Student Dashboard Routes */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardHome />} />
              <Route path="courses" element={<DashboardCourses />} />
              <Route path="interview" element={<DashboardInterview />} />
              <Route path="interview/:categoryId/:round" element={<InterviewRoundPage />} />
              <Route path="payments" element={<ComingSoon title="Payments" description="View your payment history and invoices" />} />
              <Route path="certificates" element={<ComingSoon title="Certificates" description="Download your earned certificates" />} />
              <Route path="internship" element={<ComingSoon title="Internship" description="Track your internship progress" />} />
              <Route path="resume" element={<ComingSoon title="Resume Builder" description="Create a professional resume" />} />
              <Route path="portfolio" element={<ComingSoon title="Portfolio Builder" description="Showcase your work" />} />
              <Route path="projects" element={<ComingSoon title="Live Projects" description="Access 300+ live projects" />} />
              <Route path="progress" element={<ComingSoon title="Progress Report" description="Track your learning progress" />} />
              <Route path="profile" element={<DashboardProfile />} />
            </Route>

            {/* Admin Dashboard Routes */}
            <Route path="/admin" element={<DashboardLayout isAdmin />}>
              <Route index element={<AdminDashboard />} />
              <Route path="students" element={<AdminStudents />} />
              <Route path="courses" element={<AdminCourses />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="interviews" element={<AdminInterviews />} />
              <Route path="certificates" element={<AdminCertificates />} />
              <Route path="payments" element={<AdminPayments />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
