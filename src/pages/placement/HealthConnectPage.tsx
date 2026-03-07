import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Stethoscope, Users, Calendar, CheckCircle2, ArrowRight, Shield, Clock,
  Video, MapPin, Star, Heart, FileText, Phone, Brain, Activity, Eye,
  Pill, FlaskConical, Home, Globe, Bot, Apple, Scissors, Dumbbell,
  Smile, Moon, Scale, Droplets, Thermometer, Truck, CreditCard
} from "lucide-react";

/* ───────── AI Health Checkups ───────── */
const aiCheckups = [
  { icon: Brain, title: "AI Symptom Checker", desc: "Enter symptoms, get AI-powered disease prediction & doctor recommendation", price: "₹49 – ₹99", tag: "Popular" },
  { icon: Heart, title: "Heart Rate Check", desc: "Phone camera detects your pulse in real-time using AI", price: "Free / ₹29", tag: "Free" },
  { icon: Smile, title: "Stress Level Detection", desc: "Questionnaire + voice analysis to measure stress", price: "₹99", tag: "" },
  { icon: Moon, title: "Sleep Analysis", desc: "AI sleep pattern tracking & improvement tips", price: "₹199/month", tag: "" },
  { icon: Scale, title: "BMI & Obesity Risk", desc: "Weight/height calculation with health risk score", price: "Free / ₹49", tag: "Free" },
  { icon: Droplets, title: "Diabetes Risk Assessment", desc: "AI-based diabetes risk screening questionnaire", price: "₹199 – ₹399", tag: "" },
  { icon: Activity, title: "Blood Pressure Monitor", desc: "Track BP with connected devices & AI insights", price: "₹99 – ₹199", tag: "" },
  { icon: Heart, title: "Heart Disease Risk Score", desc: "Comprehensive cardiac risk evaluation", price: "₹299", tag: "" },
  { icon: Thermometer, title: "Thyroid Risk Screening", desc: "AI thyroid risk assessment questionnaire", price: "₹199", tag: "" },
];

/* ───────── Wellness Services ───────── */
const wellnessServices = [
  {
    icon: Brain, title: "Psychological Counselling", color: "text-purple-600 bg-purple-100",
    services: ["Stress counselling", "Anxiety therapy", "Depression therapy", "Relationship counselling"],
    pricing: [{ label: "Chat session", price: "₹299" }, { label: "Video session", price: "₹799 – ₹1,500" }],
  },
  {
    icon: Dumbbell, title: "Yoga & Wellness", color: "text-green-600 bg-green-100",
    services: ["Online yoga classes", "Meditation guidance", "Stress relief programs", "Breathing exercises"],
    pricing: [{ label: "Monthly plan", price: "₹499 – ₹999" }, { label: "Personal trainer", price: "₹1,500/session" }],
  },
  {
    icon: Activity, title: "Physiotherapy", color: "text-blue-600 bg-blue-100",
    services: ["Post surgery recovery", "Back pain therapy", "Stroke rehabilitation", "Sports injury therapy"],
    pricing: [{ label: "Video consultation", price: "₹399 – ₹799" }, { label: "Home visit", price: "₹800 – ₹2,000" }],
  },
  {
    icon: Apple, title: "Diet & Weight Management", color: "text-orange-600 bg-orange-100",
    services: ["Weight loss program", "Weight gain plan", "PCOS diet", "Diabetes diet"],
    pricing: [{ label: "Diet plan", price: "₹499 – ₹999" }, { label: "Monthly coaching", price: "₹2,000 – ₹5,000" }],
  },
  {
    icon: Eye, title: "Beauty & Skin Consultation", color: "text-pink-600 bg-pink-100",
    services: ["Acne treatment", "AI skin analysis photo scan", "Anti-aging advice", "Pigmentation treatment"],
    pricing: [{ label: "AI skin analysis", price: "₹99" }, { label: "Dermatologist video", price: "₹599 – ₹1,200" }],
  },
  {
    icon: Scissors, title: "Hair Growth Treatment", color: "text-amber-600 bg-amber-100",
    services: ["Hair fall diagnosis", "AI scalp analysis", "Trichologist consultation", "PRP therapy guidance"],
    pricing: [{ label: "AI hair test", price: "₹99" }, { label: "Doctor consultation", price: "₹699 – ₹1,200" }],
  },
];

/* ───────── Medicine & Lab ───────── */
const pharmacyFeatures = [
  "Order medicines online", "Upload prescription", "Home delivery", "Auto-refill reminders", "Generic alternatives suggestion"
];
const labTests = [
  { name: "Complete Blood Count", price: "₹299" },
  { name: "Thyroid Profile", price: "₹499" },
  { name: "Vitamin D & B12", price: "₹699" },
  { name: "Diabetes Panel", price: "₹399" },
  { name: "Lipid Profile", price: "₹349" },
  { name: "Full Body Checkup", price: "₹1,499" },
];

/* ───────── Home Services ───────── */
const homeServices = [
  { icon: Activity, title: "Physiotherapy at Home", price: "₹800 – ₹2,000" },
  { icon: Stethoscope, title: "Nurse Visit", price: "₹500 – ₹1,500" },
  { icon: FlaskConical, title: "Blood Sample Collection", price: "₹200 – ₹500" },
  { icon: Users, title: "Doctor Home Visit", price: "₹1,000 – ₹3,000" },
];

/* ───────── AI Features ───────── */
const aiFeatures = [
  { icon: Bot, title: "AI Health Chatbot", desc: "24/7 health queries answered by AI" },
  { icon: Brain, title: "AI Symptom Checker", desc: "Describe symptoms, get instant analysis" },
  { icon: Clock, title: "Medicine Reminder", desc: "Never miss a dose with smart alerts" },
  { icon: Shield, title: "Health Record Locker", desc: "Secure digital health records" },
  { icon: Apple, title: "AI Diet Planner", desc: "Personalized meal plans by AI" },
  { icon: Eye, title: "AI Skin Scanner", desc: "Photo-based skin condition analysis" },
  { icon: Scissors, title: "AI Hair Scanner", desc: "Scalp health analysis from photo" },
  { icon: Dumbbell, title: "Fitness Tracker", desc: "Track steps, calories & workouts" },
];

/* ───────── Specializations ───────── */
const specializations = [
  { name: "General Medicine", icon: "🏥", doctors: "50+" },
  { name: "Pediatrics", icon: "👶", doctors: "30+" },
  { name: "Cardiology", icon: "❤️", doctors: "25+" },
  { name: "Dermatology", icon: "🧴", doctors: "35+" },
  { name: "Orthopedics", icon: "🦴", doctors: "20+" },
  { name: "Gynecology", icon: "👩‍⚕️", doctors: "40+" },
  { name: "Nursing Care", icon: "💉", doctors: "60+" },
  { name: "Physiotherapy", icon: "🏃", doctors: "15+" },
  { name: "Psychology", icon: "🧠", doctors: "20+" },
  { name: "Dentistry", icon: "🦷", doctors: "30+" },
  { name: "ENT", icon: "👂", doctors: "15+" },
  { name: "Ophthalmology", icon: "👁️", doctors: "18+" },
];

const HealthConnectPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* ── Hero ── */}
        <section className="gradient-hero text-primary-foreground py-16 lg:py-24">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <Badge className="bg-white/10 text-white mb-4">🔹 Shiksha Health Connect</Badge>
              <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Complete Healthcare Platform
              </h1>
              <p className="text-lg text-primary-foreground/80 mb-4">
                AI health checkups · Doctor consultations · Medicine delivery · Lab tests · Home services · Global consultations
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/auth">
                  <Button variant="accent" size="xl" className="gap-2"><Users className="h-5 w-5" /> Patient Login</Button>
                </Link>
                <Link to="/employer/auth">
                  <Button variant="outline" size="xl" className="gap-2 border-white/30 text-white hover:bg-white/10"><Stethoscope className="h-5 w-5" /> Doctor Login</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Specializations ── */}
        <section className="py-10 border-b">
          <div className="container">
            <h2 className="font-heading text-2xl font-bold text-foreground text-center mb-6">Specializations Available</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12 gap-3">
              {specializations.map((s) => (
                <div key={s.name} className="bg-card rounded-xl border p-3 text-center hover:shadow-card-hover transition-all cursor-pointer">
                  <div className="text-2xl mb-1">{s.icon}</div>
                  <h3 className="font-semibold text-xs text-foreground leading-tight">{s.name}</h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{s.doctors} doctors</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Tabs ── */}
        <section className="py-12">
          <div className="container">
            <Tabs defaultValue="ai-checkups" className="w-full">
              <TabsList className="flex flex-wrap h-auto gap-2 bg-muted/50 p-2 rounded-xl mb-8">
                <TabsTrigger value="ai-checkups" className="gap-1.5"><Brain className="h-4 w-4" /> AI Checkups</TabsTrigger>
                <TabsTrigger value="wellness" className="gap-1.5"><Heart className="h-4 w-4" /> Wellness</TabsTrigger>
                <TabsTrigger value="pharmacy" className="gap-1.5"><Pill className="h-4 w-4" /> Medicine & Lab</TabsTrigger>
                <TabsTrigger value="appointments" className="gap-1.5"><Calendar className="h-4 w-4" /> Appointments</TabsTrigger>
                <TabsTrigger value="home" className="gap-1.5"><Home className="h-4 w-4" /> Home Services</TabsTrigger>
                <TabsTrigger value="global" className="gap-1.5"><Globe className="h-4 w-4" /> Global</TabsTrigger>
                <TabsTrigger value="ai-features" className="gap-1.5"><Bot className="h-4 w-4" /> AI Features</TabsTrigger>
              </TabsList>

              {/* ── AI Checkups ── */}
              <TabsContent value="ai-checkups">
                <div className="text-center mb-8">
                  <Badge className="bg-primary/10 text-primary mb-2">AI-Powered</Badge>
                  <h2 className="font-heading text-3xl font-bold text-foreground mb-2">AI Health Checkups</h2>
                  <p className="text-muted-foreground">Quick, affordable, AI-based health screenings from your phone</p>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {aiCheckups.map((c) => {
                    const Icon = c.icon;
                    return (
                      <div key={c.title} className="bg-card rounded-xl border shadow-card p-6 hover:shadow-card-hover transition-all group">
                        <div className="flex items-start justify-between mb-3">
                          <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          {c.tag && <Badge variant={c.tag === "Free" ? "secondary" : "default"} className="text-xs">{c.tag}</Badge>}
                        </div>
                        <h3 className="font-heading font-semibold text-foreground mb-1">{c.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{c.desc}</p>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-primary text-sm">{c.price}</span>
                          <Button size="sm" variant="outline" className="gap-1 text-xs">Book Now <ArrowRight className="h-3 w-3" /></Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>

              {/* ── Wellness ── */}
              <TabsContent value="wellness">
                <div className="text-center mb-8">
                  <Badge className="bg-primary/10 text-primary mb-2">Wellness Services</Badge>
                  <h2 className="font-heading text-3xl font-bold text-foreground mb-2">Therapy · Yoga · Diet · Beauty</h2>
                  <p className="text-muted-foreground">Professional wellness consultations online & offline</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wellnessServices.map((s) => {
                    const Icon = s.icon;
                    return (
                      <div key={s.title} className="bg-card rounded-xl border shadow-card p-6 hover:shadow-card-hover transition-all">
                        <div className={`h-11 w-11 rounded-xl ${s.color} flex items-center justify-center mb-3`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <h3 className="font-heading font-bold text-foreground mb-2">{s.title}</h3>
                        <ul className="space-y-1 mb-4">
                          {s.services.map((sv) => (
                            <li key={sv} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <CheckCircle2 className="h-3.5 w-3.5 text-primary flex-shrink-0" />{sv}
                            </li>
                          ))}
                        </ul>
                        <div className="border-t pt-3 space-y-1.5">
                          {s.pricing.map((p) => (
                            <div key={p.label} className="flex justify-between text-sm">
                              <span className="text-muted-foreground">{p.label}</span>
                              <span className="font-semibold text-foreground">{p.price}</span>
                            </div>
                          ))}
                        </div>
                        <Button className="w-full mt-4 gap-1" size="sm">Book Now <ArrowRight className="h-3 w-3" /></Button>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>

              {/* ── Medicine & Lab ── */}
              <TabsContent value="pharmacy">
                <div className="text-center mb-8">
                  <Badge className="bg-primary/10 text-primary mb-2">Pharmacy & Lab</Badge>
                  <h2 className="font-heading text-3xl font-bold text-foreground mb-2">Medicine Delivery & Lab Tests</h2>
                  <p className="text-muted-foreground">Order medicines & book lab tests from home</p>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Pharmacy */}
                  <div className="bg-card rounded-2xl border shadow-card p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center"><Pill className="h-6 w-6 text-green-600" /></div>
                      <div>
                        <h3 className="font-heading font-bold text-foreground">Online Pharmacy</h3>
                        <p className="text-xs text-muted-foreground">10-20% commission per order</p>
                      </div>
                    </div>
                    <ul className="space-y-2 mb-4">
                      {pharmacyFeatures.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm text-foreground"><CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />{f}</li>
                      ))}
                    </ul>
                    <Button className="w-full gap-1">Order Medicines <Truck className="h-4 w-4" /></Button>
                  </div>
                  {/* Lab Tests */}
                  <div className="bg-card rounded-2xl border shadow-card p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center"><FlaskConical className="h-6 w-6 text-blue-600" /></div>
                      <div>
                        <h3 className="font-heading font-bold text-foreground">Lab Tests Booking</h3>
                        <p className="text-xs text-muted-foreground">Home sample collection available</p>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      {labTests.map((t) => (
                        <div key={t.name} className="flex items-center justify-between p-2.5 bg-muted/50 rounded-lg">
                          <span className="text-sm font-medium text-foreground">{t.name}</span>
                          <span className="text-sm font-bold text-primary">{t.price}</span>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full gap-1">Book Lab Test <ArrowRight className="h-4 w-4" /></Button>
                  </div>
                </div>
              </TabsContent>

              {/* ── Appointments ── */}
              <TabsContent value="appointments">
                <div className="text-center mb-8">
                  <Badge className="bg-primary/10 text-primary mb-2">Appointments</Badge>
                  <h2 className="font-heading text-3xl font-bold text-foreground mb-2">Hospital & Doctor Appointments</h2>
                  <p className="text-muted-foreground">Book video or physical consultations · Platform fee ₹50 – ₹150</p>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { icon: Video, title: "Video Consultation", desc: "Consult from home via HD video call", price: "₹200 – ₹1,500" },
                    { icon: MapPin, title: "Clinic Visit", desc: "Book physical appointment at clinic", price: "₹300 – ₹2,000" },
                    { icon: FileText, title: "E-Prescription", desc: "Get digital prescriptions after consult", price: "Included" },
                    { icon: Shield, title: "Health Records", desc: "Store all records securely in cloud", price: "Free" },
                  ].map((f) => {
                    const Icon = f.icon;
                    return (
                      <div key={f.title} className="bg-card rounded-xl border shadow-card p-6 text-center hover:shadow-card-hover transition-all">
                        <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                          <Icon className="h-7 w-7 text-primary" />
                        </div>
                        <h3 className="font-heading font-bold text-foreground mb-1">{f.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{f.desc}</p>
                        <span className="font-semibold text-primary text-sm">{f.price}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-center mt-8">
                  <Link to="/auth"><Button size="lg" className="gap-2"><Calendar className="h-5 w-5" /> Book Appointment Now</Button></Link>
                </div>
              </TabsContent>

              {/* ── Home Services ── */}
              <TabsContent value="home">
                <div className="text-center mb-8">
                  <Badge className="bg-primary/10 text-primary mb-2">Home Services</Badge>
                  <h2 className="font-heading text-3xl font-bold text-foreground mb-2">Healthcare at Your Doorstep</h2>
                  <p className="text-muted-foreground">Professional medical services at home</p>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {homeServices.map((s) => {
                    const Icon = s.icon;
                    return (
                      <div key={s.title} className="bg-card rounded-xl border shadow-card p-6 hover:shadow-card-hover transition-all text-center">
                        <div className="h-14 w-14 rounded-2xl bg-accent/50 flex items-center justify-center mx-auto mb-4">
                          <Icon className="h-7 w-7 text-primary" />
                        </div>
                        <h3 className="font-heading font-bold text-foreground mb-1">{s.title}</h3>
                        <p className="font-semibold text-primary text-sm mb-3">{s.price}</p>
                        <Button variant="outline" size="sm" className="w-full gap-1">Book <ArrowRight className="h-3 w-3" /></Button>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>

              {/* ── Global ── */}
              <TabsContent value="global">
                <div className="text-center mb-8">
                  <Badge className="bg-primary/10 text-primary mb-2">International</Badge>
                  <h2 className="font-heading text-3xl font-bold text-foreground mb-2">Global Medical Consultation</h2>
                  <p className="text-muted-foreground">Connect Indian doctors with international patients</p>
                </div>
                <div className="max-w-2xl mx-auto bg-card rounded-2xl border shadow-card p-8 text-center">
                  <Globe className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h3 className="font-heading text-2xl font-bold text-foreground mb-3">Second Medical Opinion</h3>
                  <p className="text-muted-foreground mb-6">Get expert opinions from top Indian specialists. Available for international patients seeking affordable, quality healthcare consultations.</p>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-muted/50 rounded-xl p-4"><p className="text-sm text-muted-foreground">Standard</p><p className="text-2xl font-bold text-primary">$20</p></div>
                    <div className="bg-muted/50 rounded-xl p-4"><p className="text-sm text-muted-foreground">Specialist</p><p className="text-2xl font-bold text-primary">$80</p></div>
                  </div>
                  <Button size="lg" className="gap-2"><Globe className="h-5 w-5" /> Request Consultation</Button>
                </div>
              </TabsContent>

              {/* ── AI Features ── */}
              <TabsContent value="ai-features">
                <div className="text-center mb-8">
                  <Badge className="bg-primary/10 text-primary mb-2">AI-Powered</Badge>
                  <h2 className="font-heading text-3xl font-bold text-foreground mb-2">Smart Health Features</h2>
                  <p className="text-muted-foreground">AI tools to monitor, manage & improve your health</p>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {aiFeatures.map((f) => {
                    const Icon = f.icon;
                    return (
                      <div key={f.title} className="bg-card rounded-xl border shadow-card p-6 hover:shadow-card-hover transition-all text-center">
                        <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                          <Icon className="h-7 w-7 text-primary" />
                        </div>
                        <h3 className="font-heading font-bold text-foreground mb-1">{f.title}</h3>
                        <p className="text-sm text-muted-foreground">{f.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* ── Doctor & Patient CTAs ── */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-card rounded-2xl border shadow-card p-8">
                <div className="text-4xl mb-4">🩺</div>
                <h3 className="font-heading text-2xl font-bold text-foreground mb-3">Doctor Registration</h3>
                <ul className="space-y-2.5 mb-6">
                  {["Profile verification & creation", "Set consultation fees", "Manage online & offline appointments", "Video consultation tools", "Patient management dashboard", "Earn from AI checkup referrals"].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-foreground"><CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />{item}</li>
                  ))}
                </ul>
                <Link to="/employer/auth"><Button className="w-full gap-2">Doctor Login <ArrowRight className="h-4 w-4" /></Button></Link>
              </div>
              <div className="bg-card rounded-2xl border shadow-card p-8">
                <div className="text-4xl mb-4">🏥</div>
                <h3 className="font-heading text-2xl font-bold text-foreground mb-3">Patient Portal</h3>
                <ul className="space-y-2.5 mb-6">
                  {["AI health checkups & screenings", "Book doctor appointments", "Video & clinic consultations", "Order medicines online", "Book lab tests with home collection", "Health record locker & AI chatbot"].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-foreground"><CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />{item}</li>
                  ))}
                </ul>
                <Link to="/auth"><Button variant="outline" className="w-full gap-2">Patient Login <ArrowRight className="h-4 w-4" /></Button></Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Revenue Model ── */}
        <section className="py-16">
          <div className="container">
            <div className="text-center mb-10">
              <Badge className="bg-primary/10 text-primary mb-2">Business Model</Badge>
              <h2 className="font-heading text-3xl font-bold text-foreground">Revenue Streams</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: CreditCard, title: "AI Checkups", desc: "₹29 – ₹399 per test", revenue: "Direct" },
                { icon: Video, title: "Consultations", desc: "₹50 – ₹150 platform fee", revenue: "Commission" },
                { icon: Pill, title: "Pharmacy", desc: "10-20% per order", revenue: "Commission" },
                { icon: Home, title: "Home Services", desc: "₹500 – ₹3,000", revenue: "Service Fee" },
              ].map((r) => {
                const Icon = r.icon;
                return (
                  <div key={r.title} className="bg-card rounded-xl border p-5 text-center">
                    <Icon className="h-8 w-8 text-primary mx-auto mb-3" />
                    <h3 className="font-bold text-foreground mb-1">{r.title}</h3>
                    <p className="text-sm text-muted-foreground mb-1">{r.desc}</p>
                    <Badge variant="secondary" className="text-xs">{r.revenue}</Badge>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HealthConnectPage;
