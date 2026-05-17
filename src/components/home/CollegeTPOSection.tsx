import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import {
  GraduationCap,
  Users,
  Award,
  Briefcase,
  Mail,
  Loader2,
  CheckCircle2,
} from "lucide-react";

const schema = z.object({
  college_name: z.string().trim().min(2, "College name required").max(200),
  first_name: z.string().trim().min(1, "First name required").max(80),
  last_name: z.string().trim().min(1, "Last name required").max(80),
  official_email: z.string().trim().email("Invalid email").max(255),
  mobile: z.string().trim().regex(/^[0-9]{10}$/, "Enter a valid 10-digit mobile"),
  designation: z.string().trim().min(2, "Designation required").max(120),
  department: z.string().trim().min(2, "Department required").max(120),
  city: z.string().trim().min(2, "City required").max(120),
});

const initial = {
  college_name: "",
  first_name: "",
  last_name: "",
  official_email: "",
  mobile: "",
  designation: "",
  department: "",
  city: "",
};

const CollegeTPOSection = () => {
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const update = (k: keyof typeof initial, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast({
        title: "Please fix the form",
        description: parsed.error.errors[0]?.message,
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    const { error } = await supabase
      .from("college_registrations")
      .insert(parsed.data);
    setLoading(false);
    if (error) {
      toast({
        title: "Submission failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    setSuccess(true);
    setForm(initial);
    toast({
      title: "Registration submitted!",
      description: "Our team will reach out shortly.",
    });
  };

  return (
    <section className="py-20 lg:py-24 bg-muted/30">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
            <GraduationCap className="h-3.5 w-3.5" /> For Colleges & Universities
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-3">
            Register your college with Aadhyra
          </h2>
          <p className="text-muted-foreground">
            Maximize your students' opportunities by connecting with our 1,000+ hiring partners across IT, Healthcare, HR and Marketing.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Form */}
          <Card className="lg:col-span-3 shadow-card border-0">
            <CardContent className="p-6 md:p-8">
              <h3 className="font-heading text-xl font-semibold mb-1">
                Registration form for college authorities
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Takes less than 2 minutes
              </p>

              {success ? (
                <div className="flex flex-col items-center text-center py-10">
                  <CheckCircle2 className="h-14 w-14 text-healthcare mb-3" />
                  <h4 className="font-heading text-lg font-semibold mb-1">
                    Thank you for registering!
                  </h4>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Our University Relations team will contact you within 24 hours.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-5"
                    onClick={() => setSuccess(false)}
                  >
                    Submit another
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label>College Name *</Label>
                    <Input
                      value={form.college_name}
                      onChange={(e) => update("college_name", e.target.value)}
                      placeholder="e.g. Anna University"
                      required
                    />
                  </div>
                  <div>
                    <Label>First Name *</Label>
                    <Input
                      value={form.first_name}
                      onChange={(e) => update("first_name", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label>Last Name *</Label>
                    <Input
                      value={form.last_name}
                      onChange={(e) => update("last_name", e.target.value)}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Official Email *</Label>
                    <Input
                      type="email"
                      value={form.official_email}
                      onChange={(e) => update("official_email", e.target.value)}
                      placeholder="placement@college_name.com"
                      required
                    />
                  </div>
                  <div>
                    <Label>Mobile Number *</Label>
                    <Input
                      type="tel"
                      value={form.mobile}
                      onChange={(e) => update("mobile", e.target.value)}
                      placeholder="10-digit mobile"
                      maxLength={10}
                      required
                    />
                  </div>
                  <div>
                    <Label>Designation *</Label>
                    <Input
                      value={form.designation}
                      onChange={(e) => update("designation", e.target.value)}
                      placeholder="e.g. TPO, Principal"
                      required
                    />
                  </div>
                  <div>
                    <Label>Department *</Label>
                    <Input
                      value={form.department}
                      onChange={(e) => update("department", e.target.value)}
                      placeholder="e.g. Placement Cell"
                      required
                    />
                  </div>
                  <div>
                    <Label>City *</Label>
                    <Input
                      value={form.city}
                      onChange={(e) => update("city", e.target.value)}
                      placeholder="Start typing..."
                      required
                    />
                  </div>

                  <div className="md:col-span-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5" />
                      Need help? <a href="mailto:university.relations@addhyrainnovations.com" className="text-primary hover:underline">university.relations@addhyrainnovations.com</a>
                    </p>
                    <Button type="submit" disabled={loading} size="lg">
                      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                      Register Now
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Benefits */}
          <div className="lg:col-span-2 space-y-5">
            <h3 className="font-heading text-xl font-semibold">Why register?</h3>
            <BenefitItem
              Icon={GraduationCap}
              color="text-tech bg-tech/10"
              title="Personalised college dashboard"
              desc="Get a personalized dashboard and regular updates to monitor your students' internship & placement selections."
            />
            <BenefitItem
              Icon={Users}
              color="text-marketing bg-marketing/10"
              title="Free student registration"
              desc="We will provide all your students with a free Aadhyra account once you share their details with us."
            />
            <BenefitItem
              Icon={Award}
              color="text-healthcare bg-healthcare/10"
              title="A prestigious certificate"
              desc="Certificate of appreciation for registering the maximum number of students for internships and jobs."
            />
            <BenefitItem
              Icon={Briefcase}
              color="text-design bg-design/10"
              title="Access to internships & jobs"
              desc="Students can apply for exciting opportunities in IT, healthcare, marketing, HR and many more categories."
            />

            <div className="rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 p-4 text-sm">
              <p className="font-semibold text-foreground">
                500+ colleges already associated with us
              </p>
              <p className="text-muted-foreground mt-1">
                Join India's fastest-growing training & placement network.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const BenefitItem = ({ Icon, color, title, desc }: any) => (
  <div className="flex gap-3">
    <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <h4 className="font-semibold text-sm">{title}</h4>
      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>
    </div>
  </div>
);

export default CollegeTPOSection;
