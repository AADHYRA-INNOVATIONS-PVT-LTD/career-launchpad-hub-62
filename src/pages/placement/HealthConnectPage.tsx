import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Stethoscope, Users, Calendar, CheckCircle2, ArrowRight, Shield, Clock, Video, MapPin, Star, Heart, FileText, Phone } from "lucide-react";

const doctorFeatures = [
  { icon: Shield, title: "Profile Verification", description: "Medical license, degree, and specialization verified by our team" },
  { icon: FileText, title: "Profile Creation", description: "Create detailed doctor profile with specializations, experience, and fees" },
  { icon: Calendar, title: "Appointment Scheduling", description: "Set your availability, manage appointments online and offline" },
  { icon: Video, title: "Online Consultation", description: "Conduct video consultations with patients securely" },
  { icon: MapPin, title: "Clinic Location", description: "List your clinic for walk-in patient bookings" },
  { icon: Star, title: "Patient Reviews", description: "Build your reputation through patient ratings and feedback" },
];

const patientFeatures = [
  { icon: Stethoscope, title: "Find Doctors", description: "Search verified doctors by specialization, location, and fees" },
  { icon: Calendar, title: "Book Appointments", description: "Book online video consultation or offline clinic visit" },
  { icon: Clock, title: "Scheduling Options", description: "Choose from available time slots that suit your schedule" },
  { icon: Phone, title: "Teleconsultation", description: "Consult with doctors from the comfort of your home" },
  { icon: FileText, title: "Medical Records", description: "Store and share prescriptions and medical history securely" },
  { icon: Heart, title: "Health Tracking", description: "Track your health metrics and follow-up appointments" },
];

const specializations = [
  { name: "General Medicine", icon: "🏥", doctors: "50+" },
  { name: "Pediatrics", icon: "👶", doctors: "30+" },
  { name: "Cardiology", icon: "❤️", doctors: "25+" },
  { name: "Dermatology", icon: "🧴", doctors: "35+" },
  { name: "Orthopedics", icon: "🦴", doctors: "20+" },
  { name: "Gynecology", icon: "👩‍⚕️", doctors: "40+" },
  { name: "Nursing Care", icon: "💉", doctors: "60+" },
  { name: "Physiotherapy", icon: "🏃", doctors: "15+" },
];

const HealthConnectPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="gradient-hero text-primary-foreground py-16 lg:py-24">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <Badge className="bg-white/10 text-white mb-4">🔹 Shiksha Health Connect</Badge>
              <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Doctor & Patient Healthcare Platform
              </h1>
              <p className="text-lg text-primary-foreground/80 mb-8">
                Book appointments online or offline, consult verified doctors, and manage your healthcare seamlessly.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/auth">
                  <Button variant="accent" size="xl" className="gap-2">
                    <Users className="h-5 w-5" /> Patient Login
                  </Button>
                </Link>
                <Link to="/employer/auth">
                  <Button variant="outline" size="xl" className="gap-2 border-white/30 text-white hover:bg-white/10">
                    <Stethoscope className="h-5 w-5" /> Doctor Login
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Specializations */}
        <section className="py-12 border-b">
          <div className="container">
            <h2 className="font-heading text-2xl font-bold text-foreground text-center mb-8">Specializations Available</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
              {specializations.map((s) => (
                <div key={s.name} className="bg-card rounded-xl border p-4 text-center hover:shadow-card-hover transition-all cursor-pointer">
                  <div className="text-3xl mb-2">{s.icon}</div>
                  <h3 className="font-semibold text-xs text-foreground">{s.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{s.doctors} doctors</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Doctor Features */}
        <section className="py-16">
          <div className="container">
            <div className="text-center mb-12">
              <Badge className="bg-primary/10 text-primary mb-3">For Doctors</Badge>
              <h2 className="font-heading text-3xl font-bold text-foreground mb-3">Doctor Portal Features</h2>
              <p className="text-muted-foreground">Register, verify, and start consultations</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {doctorFeatures.map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.title} className="bg-card rounded-xl border shadow-card p-6 hover:shadow-card-hover transition-all">
                    <div className="h-12 w-12 rounded-xl bg-healthcare/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-healthcare" />
                    </div>
                    <h3 className="font-heading font-semibold text-foreground mb-2">{f.title}</h3>
                    <p className="text-sm text-muted-foreground">{f.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Patient Features */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <Badge className="bg-primary/10 text-primary mb-3">For Patients</Badge>
              <h2 className="font-heading text-3xl font-bold text-foreground mb-3">Patient Portal Features</h2>
              <p className="text-muted-foreground">Book appointments, consult online, manage health</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {patientFeatures.map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.title} className="bg-card rounded-xl border shadow-card p-6 hover:shadow-card-hover transition-all">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-heading font-semibold text-foreground mb-2">{f.title}</h3>
                    <p className="text-sm text-muted-foreground">{f.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Two Login CTAs */}
        <section className="py-16">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-card rounded-2xl border shadow-card p-8">
                <div className="text-4xl mb-4">🩺</div>
                <h3 className="font-heading text-2xl font-bold text-foreground mb-3">Doctor Registration</h3>
                <ul className="space-y-3 mb-6">
                  {["Create verified profile", "Set consultation fees", "Manage appointments", "Online & offline bookings", "Patient management dashboard"].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                      <CheckCircle2 className="h-4 w-4 text-healthcare flex-shrink-0" />{item}
                    </li>
                  ))}
                </ul>
                <Link to="/employer/auth"><Button className="w-full gap-2 bg-healthcare hover:bg-healthcare/90">Doctor Login <ArrowRight className="h-4 w-4" /></Button></Link>
              </div>
              <div className="bg-card rounded-2xl border shadow-card p-8">
                <div className="text-4xl mb-4">🏥</div>
                <h3 className="font-heading text-2xl font-bold text-foreground mb-3">Patient Portal</h3>
                <ul className="space-y-3 mb-6">
                  {["Search verified doctors", "Book online/offline appointments", "Video consultation", "Prescription storage", "Health record management"].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />{item}
                    </li>
                  ))}
                </ul>
                <Link to="/auth"><Button variant="outline" className="w-full gap-2">Patient Login <ArrowRight className="h-4 w-4" /></Button></Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HealthConnectPage;
