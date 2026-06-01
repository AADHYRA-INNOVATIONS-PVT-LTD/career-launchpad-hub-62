import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Loader2 } from 'lucide-react';

interface DashboardLayoutProps {
  isAdmin?: boolean;
  role?: "student" | "freelancer" | "patient" | "doctor" | "employer"; // 1. Added patient to the TypeScript allowed roles
}

const DashboardLayout = ({ isAdmin, role = "student" }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading, isAdmin: userIsAdmin } = useAuth();
  const navigate = useNavigate();

  // 2. Cleaned up duplicate blocks into a single consolidated route-guard hook
  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Appends the current layout role context directly to the fallback route
        navigate(`/auth?role=${role}`); 
      } else if (isAdmin && !userIsAdmin) {
        navigate('/dashboard');
      }
    }
  }, [user, loading, isAdmin, userIsAdmin, navigate, role]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // 3. Determine header title text dynamically including the new patient state
  const getHeaderTitle = () => {
    if (isAdmin) return 'Admin Dashboard';
    switch (role) {
      case 'doctor':
        return 'Medical Practitioner Portal';
      case 'patient':
        return 'Patient Dashboard';
      case 'freelancer':
        return 'Freelancer Dashboard';
      case 'employer':
        return 'Employer Workspace';
      case 'student':
      default:
        return 'Student Dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <DashboardSidebar isAdmin={isAdmin} role={role} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 lg:hidden transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <DashboardSidebar isAdmin={isAdmin} role={role} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader
          title={getHeaderTitle()}
          role={role}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;