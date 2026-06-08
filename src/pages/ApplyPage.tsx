import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, ChevronRight, FileText, CreditCard, LayoutDashboard, Shield, AlertTriangle, Lock, MessageSquare, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { useEnrollment } from "@/hooks/useEnrollment";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const courses = [
  { value: "java-fullstack", label: "Java Full Stack", category: "IT", price: 19999 },
  { value: "python-fullstack", label: "Python Full Stack", category: "IT", price: 19999 },
  { value: "ai-ml", label: "AI / Machine Learning", category: "IT", price: 19999 },
  { value: "data-analytics", label: "Data Analytics", category: "IT", price: 19999 },
  { value: "data-science", label: "Data Science", category: "IT", price: 19999 },
  { value: "aws-cloud", label: "AWS & Cloud Computing", category: "IT", price: 19999 },
  { value: "cyber-security", label: "Cyber Security", category: "IT", price: 19999 },
  { value: "hr-generalist", label: "HR Generalist", category: "HR", price: 5999 },
  { value: "hr-recruiter", label: "HR Recruiter", category: "HR", price: 5999 },
  { value: "payroll-compliance", label: "Payroll & Compliance", category: "HR", price: 5999 },
  { value: "talent-acquisition", label: "Talent Acquisition", category: "HR", price: 5999 },
  { value: "digital-marketing", label: "Complete Digital Marketing", category: "Marketing", price: 19999 },
  { value: "seo", label: "SEO Mastery", category: "Marketing", price: 19999 },
  { value: "smm", label: "Social Media Marketing", category: "Marketing", price: 19999 },
  { value: "google-ads", label: "Google Ads (PPC)", category: "Marketing", price: 19999 },
  { value: "photoshop", label: "Adobe Photoshop", category: "Design", price: 19999 },
  { value: "illustrator", label: "Adobe Illustrator", category: "Design", price: 19999 },
  { value: "ui-ux", label: "UI/UX Design", category: "Design", price: 19999 },
  { value: "branding", label: "Branding & Visual Design", category: "Design", price: 19999 },
  { value: "clinical-training", label: "Advanced Clinical Training", category: "Nursing", price: 20999 },
  { value: "icu-emergency", label: "ICU & Emergency Care", category: "Nursing", price: 20999 },
  { value: "patient-care", label: "Patient Care & Documentation", category: "Nursing", price: 20999 },
];

const steps = [
  { id: 1, title: "Registration", icon: FileText },
  { id: 2, title: "Policy Agreement", icon: Shield },
  { id: 3, title: "Payment", icon: CreditCard },
  { id: 4, title: "Dashboard", icon: LayoutDashboard },
];

const COURSE_ID_MAP: Record<string, string> = {
  'java-fullstack': '5e2ce23b-394b-40d8-84f1-85c486a2fd6b',
  'python-fullstack': '587d1c71-9f38-4c25-8187-2fbbd7e71cc8',
  'ai-ml': '6801bba2-262b-4b38-b486-6e8bcafb3c8e',
  // You can find these by running: SELECT id, slug FROM courses; in SQL Editor
};

const ApplyPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    course: "",
    vertical: "",
  });
  
  // Policy agreements
  const [agreements, setAgreements] = useState({
    feesPolicy: false,
    ndaPolicy: false,
    socialPolicy: false,
    finalConsent: false,
  });
  
  const [hasScrolledPolicies, setHasScrolledPolicies] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { checkEnrollment, createEnrollment } = useEnrollment();
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);

  const allPoliciesAgreed = Object.values(agreements).every(Boolean);
  const selectedCourse = courses.find(c => c.value === formData.course);
  
  const progress = (currentStep / steps.length) * 100;
  const [invoiceNo] = useState(`SNX-${Date.now().toString().slice(-8)}`);

  const applicationSchema = z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
    mobile: z.string().trim().regex(/^[+\d\s-]{7,15}$/, "Enter a valid phone number"),
    email: z.string().trim().email("Enter a valid email").max(255),
    course: z.string().min(1, "Please select a course"),
    vertical: z.string().min(1, "Please select a preferred vertical"),
  });

  useEffect(() => {
    // 1. Fetch course ID first, then check enrollment
    const verifyEnrollment = async () => {
      if (user?.id && selectedCourse?.value) {
        // Fetch the actual UUID for the course using the slug
        const { data: course } = await supabase
          .from('courses')
          .select('id')
          .eq('slug', selectedCourse.value)
          .maybeSingle();

        if (course?.id) {
          const res = await checkEnrollment(user.id, course.id);
          setIsAlreadyRegistered(res.isEnrolled);
        } else {
          setIsAlreadyRegistered(false);
        }
      }
    };
    verifyEnrollment();

    // 2. Restore pending application if user just logged in
    const saved = localStorage.getItem('pendingApplication');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setFormData(data.formData);
        setAgreements(data.agreements);
        if (data.courseValue) {
           setCurrentStep(3); // Take them straight to payment
        }
        localStorage.removeItem('pendingApplication');
        
        if (user) {
          toast({ title: "Welcome back!", description: "Your progress has been restored. You can now complete your payment." });
        }
      } catch (e) {
        console.error("Failed to parse pending application", e);
      }
    }
  }, [user?.id, selectedCourse?.label, toast]);


  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = applicationSchema.safeParse(formData);
    if (!parsed.success) {
      toast({
        title: "Please check your details",
        description: parsed.error.issues[0].message,
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase.from("applications").insert({
      user_id: user?.id ?? null,
      full_name: parsed.data.name,
      phone: parsed.data.mobile,
      email: parsed.data.email,
      course: selectedCourse?.label ?? parsed.data.course,
      vertical: parsed.data.vertical,
    });

    if (error) {
      toast({
        title: "Submission failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Application received",
      description: "Our team will reach out shortly. Continue to complete enrollment.",
    });
    setCurrentStep(2);
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        setHasScrolledPolicies(true);
      }
    }
  };

  const handleStep2Submit = () => {
    if (!allPoliciesAgreed) {
      toast({
        title: "Agreement Required",
        description: "You must agree to all policies to proceed.",
        variant: "destructive",
      });
      return;
    }
    setCurrentStep(3);
  };

// const handlePayment = async () => {
//     setIsProcessingPayment(true);
//   console.log("DEBUG: Current selectedCourse object:", selectedCourse);
//     const selectedSlug = selectedCourse?.value; 
//   const courseId = COURSE_ID_MAP[selectedSlug];

//   if (!courseId) {
//     console.error("Course mapping not found!");
//     setIsProcessingPayment(false);
//     return;
//   }
    
//     await new Promise(resolve => setTimeout(resolve, 2000));
    
//     const courseLabel = selectedCourse?.label || 'Selected Course';
    
//     // UPDATED: Destructure the error object to see details
//     const { data, error } = await createEnrollment(user?.id, courseLabel);
    
//     if (error) {
//       console.error("FULL SUPABASE ERROR:", error); // <-- THIS WILL SHOW THE COLUMN NAME
//       toast({
//         title: "Enrollment Error",
//         description: `Details: ${error.message}`, // Shows exact DB error
//         variant: "destructive",
//       });
//       setIsProcessingPayment(false);
//       return;
//     }

//     // 3. Show Success Toast
//     toast({
//       title: "Payment Successful!",
//       description: "Your enrollment is confirmed. Invoice sent to your email.",
//     });
    
//     // 4. Finalize UI and Redirect
//     setIsProcessingPayment(false);
//     setCurrentStep(4);
    
//     // Optional: Redirect after a small delay so they can see the "Success" screen
//     setTimeout(() => {
//         navigate('/dashboard');
//     }, 2000);
//   };

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const handlePaymentGuard = () => {
  if (isAlreadyRegistered) {
    toast({
      title: "Already Registered",
      description: "You have already registered for this course. Please try a different course.",
      variant: "destructive",
    });
    return;
  }
  
  // If not registered, proceed with the actual payment
  handlePayment();
};

const handlePayment = async () => {
  if (!user) {
    // Save progress to local storage
    localStorage.setItem('pendingApplication', JSON.stringify({
      formData,
      agreements,
      courseValue: selectedCourse?.value
    }));

    toast({ 
      title: "Authentication Required", 
      description: "We've saved your progress. Please log in to complete your payment.", 
    });
    navigate("/auth?redirect=/apply");
    return;
  }

  setIsProcessingPayment(true);

  // 1. Fetch the course ID from your database
  const { data: course, error: fetchError } = await supabase
    .from('courses')
    .select('id')
    .eq('slug', selectedCourse?.value)
    .maybeSingle();

  if (fetchError || !course) {
    console.error("Course not found:", fetchError);
    toast({ title: "Error", description: "Course not found.", variant: "destructive" });
    setIsProcessingPayment(false);
    return;
  }

  // 2. Load Razorpay
  const res = await loadRazorpayScript();
  if (!res) {
    toast({ title: "Error", description: "Razorpay SDK failed to load. Are you online?", variant: "destructive" });
    setIsProcessingPayment(false);
    return;
  }

  try {
    // 3. Create order via edge function
    const { data: orderData, error: orderError } = await supabase.functions.invoke('create-razorpay-order', {
      body: { amount: selectedCourse!.price }
    });

    if (orderError || !orderData) {
      throw new Error(orderError?.message || "Failed to initialize payment gateway.");
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_mock_key',
      amount: orderData.amount,
      currency: orderData.currency,
      name: "AADHYRA INNOVATIONS",
      description: `Enrollment: ${selectedCourse!.label}`,
      order_id: orderData.id,
      handler: async function (response: any) {
        try {
          setIsProcessingPayment(true);
          // Verify payment
          const { data: verificationData, error: verificationError } = await supabase.functions.invoke('verify-razorpay-payment', {
            body: {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            }
          });

          if (verificationError || !verificationData?.success) {
            throw new Error("Payment verification failed");
          }

          // 4. Save the enrollment ONLY after successful payment verification
          const { error: enrollError } = await createEnrollment(user.id, course.id, selectedCourse!.price);

          if (enrollError) {
            const errorMsg = typeof enrollError === 'string' ? enrollError.toLowerCase() : (enrollError?.message || '').toLowerCase();
            const errorCode = typeof enrollError === 'object' ? enrollError?.code : null;

            if (errorCode === '23505' || errorMsg.includes('already')) {
              toast({ title: "Already Enrolled", description: "You are already registered for this course.", variant: "destructive" });
            } else {
              toast({ title: "Enrollment Error", description: "Payment succeeded but enrollment failed. Contact support.", variant: "destructive" });
            }
          } else {
            toast({ title: "Payment Successful!", description: "Your enrollment is confirmed." });
            setCurrentStep(4);
          }
        } catch (err) {
          console.error("Verification error:", err);
          toast({ title: "Error", description: "Payment verification failed. Please contact support.", variant: "destructive" });
        } finally {
          setIsProcessingPayment(false);
        }
      },
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: formData.mobile
      },
      theme: { color: "#38bdf8" },
      modal: {
        ondismiss: function() {
          setIsProcessingPayment(false);
        }
      }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  } catch (err) {
    console.error(err);
    toast({ title: "Error", description: "Could not connect to payment gateway.", variant: "destructive" });
    setIsProcessingPayment(false);
  }
};

 const handlePaymentSuccess = async () => {
    // Make sure to use the correct label or value
    const courseLabel = selectedCourse?.value || 'Java Full Stack';
    
    const { error } = await createEnrollment(user?.id, courseLabel, selectedCourse.price);
    
    if (!error) {
      navigate('/dashboard'); // Use the 'navigate' function you already have
    } else {
      toast({
        title: "Enrollment Error",
        description: "Something went wrong saving your enrollment.",
        variant: "destructive"
      });
    }
  };

 const generateInvoice = (formData: any, selectedCourse: any, invoiceNo: string) => {
  console.log("Button clicked!");
  const doc = new jsPDF();
  
  // 1. Company Header
  doc.setFontSize(20);
  doc.text("Aadhyra Innovations Private Limited", 14, 20);
  doc.setFontSize(10);
  doc.text("123 Tech Street, Electronic City Phase 1, Bangalore", 14, 27);
  doc.text("Email: support@aadhyra.com", 14, 32);
  
  // Draw a horizontal line
  doc.line(14, 37, 195, 37);

  // 2. Invoice Metadata
  doc.setFontSize(12);
  doc.text(`Invoice #: ${invoiceNo}`, 140, 45);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 140, 52);

  // 3. Bill To Section
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text("Bill To:", 14, 45);
  doc.setFont(undefined, 'normal');
  doc.text(formData.name, 14, 52);
  doc.text(formData.email, 14, 59);
  doc.text(formData.mobile, 14, 66);

  // 4. Items Table
  autoTable(doc, {
    startY: 80,
    head: [['Description', 'Category', 'Amount']],
    body: [
      [
        selectedCourse.value, 
        selectedCourse.category, 
        'Rs. ' + selectedCourse.price.toLocaleString('en-IN')
      ],
    ],
    foot: [
      ['', 'Total', 'Rs. ' + selectedCourse.price.toLocaleString('en-IN')]
    ],
    theme: 'grid',
    headStyles: { fillColor: [41, 128, 185] },
  });

  // 5. Footer / Disclaimer
  doc.setFontSize(9);
  doc.text("Note: Fees are non-refundable. This is a computer-generated invoice.", 14, 280);

  doc.save(`Invoice_${invoiceNo}.pdf`);
};

  const handleGoToDashboard = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="gradient-hero text-primary-foreground py-12 lg:py-16">
          <div className="container">
            <div className="max-w-2xl">
              <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4">
                Apply Now
              </h1>
              <p className="text-lg text-white/80">
                Complete your enrollment in 4 simple steps
              </p>
            </div>
          </div>
        </section>

        {/* Progress Steps */}
        <section className="py-8 border-b bg-card">
          <div className="container">
            <div className="flex items-center justify-between max-w-3xl mx-auto">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = currentStep > step.id;
                const isCurrent = currentStep === step.id;
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        isCompleted ? "bg-green-500 text-white" :
                        isCurrent ? "bg-primary text-primary-foreground" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {isCompleted ? <CheckCircle2 className="h-6 w-6" /> : <Icon className="h-5 w-5" />}
                      </div>
                      <span className={`text-xs mt-2 font-medium ${isCurrent ? "text-primary" : "text-muted-foreground"}`}>
                        {step.title}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-16 md:w-24 h-1 mx-2 rounded ${
                        currentStep > step.id ? "bg-green-500" : "bg-muted"
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
            <Progress value={progress} className="mt-6 max-w-3xl mx-auto h-2" />
          </div>
        </section>

        {/* Form Section */}
        <section className="py-12 lg:py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              
              {/* Step 1: Registration */}
              {currentStep === 1 && (
                <div className="bg-card rounded-2xl border shadow-card p-8">
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                    <FileText className="h-6 w-6 text-primary" />
                    Step 1: User Registration
                  </h2>
                  
                  <form onSubmit={handleStep1Submit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="mobile">Mobile Number *</Label>
                      <Input
                        id="mobile"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.mobile}
                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Course / Service Selected *</Label>
                      <Select value={formData.course} onValueChange={(value) => setFormData({ ...formData, course: value })} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a course" />
                        </SelectTrigger>
                        <SelectContent>
                          {courses.map((course) => (
                            <SelectItem key={course.value} value={course.value}>
                              {course.label} ({course.category}) - ₹{course.price.toLocaleString()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Preferred Vertical *</Label>
                      <Select value={formData.vertical} onValueChange={(value) => setFormData({ ...formData, vertical: value })} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose your career interest" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="IT">IT & Software</SelectItem>
                          <SelectItem value="HR">HR & Recruitment</SelectItem>
                          <SelectItem value="Marketing">Digital Marketing</SelectItem>
                          <SelectItem value="Design">Graphic & UI/UX Design</SelectItem>
                          <SelectItem value="Nursing">Nursing & Healthcare</SelectItem>
                          <SelectItem value="Other">Not sure yet</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button type="submit" variant="hero" size="lg" className="w-full">
                      Next: Policy Agreement <ChevronRight className="h-5 w-5 ml-2" />
                    </Button>
                  </form>
                </div>
              )}

              {/* Step 2: Policy Agreement */}
              {currentStep === 2 && (
                <div className="bg-card rounded-2xl border shadow-card p-8">
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-2 flex items-center gap-3">
                    <Shield className="h-6 w-6 text-primary" />
                    Step 2: Mandatory Policy Reading
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Please read and agree to all policies. You must scroll through the entire document.
                  </p>
                  
                  <ScrollArea 
                    className="h-[400px] rounded-lg border bg-muted/30 p-6" 
                    ref={scrollRef}
                    onScrollCapture={handleScroll}
                  >
                    <div className="space-y-8">
                      {/* Section 1: Fees & Refund Policy */}
                      <div className="bg-card rounded-xl border p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <AlertTriangle className="h-6 w-6 text-amber-500" />
                          <h3 className="font-heading text-lg font-bold text-foreground">
                            SECTION 1: FEES & REFUND POLICY
                          </h3>
                        </div>
                        
                        <div className="prose prose-sm text-muted-foreground space-y-4">
                          <p className="font-semibold text-foreground">
                            Fees & Service Policy – Mandatory Agreement
                          </p>
                          
                          <p>
                            AADHYRA INNOVATIONS PVT LTD does not sell jobs or guarantee employment.
                          </p>
                          
                          <p className="font-medium text-foreground">All fees collected are strictly for:</p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Registration & Profile Evaluation</li>
                            <li>Career Counseling</li>
                            <li>Training & Skill Development</li>
                            <li>Internship & Placement Support</li>
                          </ul>
                          
                          <p className="font-medium text-foreground">I clearly understand and agree that:</p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Evaluation, training, and registration fees are <strong>NON-REFUNDABLE</strong> under any circumstances</li>
                            <li>Fees are considered utilized once the service is initiated</li>
                            <li>Discontinuation or non-participation from my side does not make the company responsible</li>
                            <li>Final selection depends on my performance and employer requirements</li>
                          </ul>
                        </div>
                        
                        <div className="flex items-center space-x-3 mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                          <Checkbox 
                            id="feesPolicy" 
                            checked={agreements.feesPolicy}
                            onCheckedChange={(checked) => setAgreements({ ...agreements, feesPolicy: checked as boolean })}
                          />
                          <label htmlFor="feesPolicy" className="text-sm font-medium cursor-pointer">
                            I have read and agree to the Fees & Non-Refund Policy
                          </label>
                        </div>
                      </div>

                      {/* Section 2: NDA & Confidentiality */}
                      <div className="bg-card rounded-xl border p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Lock className="h-6 w-6 text-blue-500" />
                          <h3 className="font-heading text-lg font-bold text-foreground">
                            SECTION 2: NDA & CONFIDENTIALITY AGREEMENT
                          </h3>
                        </div>
                        
                        <div className="prose prose-sm text-muted-foreground space-y-4">
                          <p className="font-semibold text-foreground">
                            Confidentiality & NDA Agreement – Mandatory
                          </p>
                          
                          <p>I agree that all information related to:</p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Aadhyra Innovations internal processes</li>
                            <li>Training methods</li>
                            <li>Placement partners</li>
                            <li>HR practices</li>
                            <li>Company documents</li>
                          </ul>
                          <p>is strictly confidential.</p>
                          
                          <p className="font-medium text-foreground">I agree:</p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Not to share any company-related information with third parties</li>
                            <li>Not to post, publish, or discuss Aadhyra Innovations information on social media, forums, or public platforms</li>
                            <li>Not to misuse company name, logo, or internal communication</li>
                          </ul>
                        </div>
                        
                        <div className="flex items-center space-x-3 mt-6 p-4 bg-blue-500/5 rounded-lg border border-blue-500/20">
                          <Checkbox 
                            id="ndaPolicy" 
                            checked={agreements.ndaPolicy}
                            onCheckedChange={(checked) => setAgreements({ ...agreements, ndaPolicy: checked as boolean })}
                          />
                          <label htmlFor="ndaPolicy" className="text-sm font-medium cursor-pointer">
                            I agree to the NDA & Confidentiality Terms
                          </label>
                        </div>
                      </div>

                      {/* Section 3: Social Media & Review Policy */}
                      <div className="bg-card rounded-xl border p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <MessageSquare className="h-6 w-6 text-purple-500" />
                          <h3 className="font-heading text-lg font-bold text-foreground">
                            SECTION 3: SOCIAL MEDIA & REVIEW POLICY
                          </h3>
                        </div>
                        
                        <div className="prose prose-sm text-muted-foreground space-y-4">
                          <p className="font-semibold text-foreground">
                            Public Communication & Review Policy
                          </p>
                          
                          <p>I understand that:</p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>I do not have the right to post misleading, false, or defamatory content about Aadhyra Innovations</li>
                            <li>Any concerns must be raised directly with the Aadhyra Innovations support team</li>
                            <li>Posting negative or false reviews without completing the process is considered unethical</li>
                          </ul>
                          
                          <p className="font-medium text-foreground">
                            Aadhyra Innovations reserves the right to take appropriate action in case of policy violation.
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-3 mt-6 p-4 bg-purple-500/5 rounded-lg border border-purple-500/20">
                          <Checkbox 
                            id="socialPolicy" 
                            checked={agreements.socialPolicy}
                            onCheckedChange={(checked) => setAgreements({ ...agreements, socialPolicy: checked as boolean })}
                          />
                          <label htmlFor="socialPolicy" className="text-sm font-medium cursor-pointer">
                            I agree to the Communication & Review Policy
                          </label>
                        </div>
                      </div>

                      {/* Section 4: Final Consent */}
                      <div className="bg-card rounded-xl border p-6 border-primary/30">
                        <div className="flex items-center gap-3 mb-4">
                          <CheckCircle2 className="h-6 w-6 text-green-500" />
                          <h3 className="font-heading text-lg font-bold text-foreground">
                            SECTION 4: FINAL CONSENT DECLARATION
                          </h3>
                        </div>
                        
                        <div className="prose prose-sm text-muted-foreground space-y-4">
                          <p className="font-medium text-foreground">I confirm that:</p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>I am joining Aadhyra Innovations voluntarily</li>
                            <li>I have understood all policies clearly</li>
                            <li>I agree to proceed without coercion</li>
                            <li>I accept all terms digitally as a legally valid agreement</li>
                          </ul>
                        </div>
                        
                        <div className="flex items-center space-x-3 mt-6 p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                          <Checkbox 
                            id="finalConsent" 
                            checked={agreements.finalConsent}
                            onCheckedChange={(checked) => setAgreements({ ...agreements, finalConsent: checked as boolean })}
                          />
                          <label htmlFor="finalConsent" className="text-sm font-semibold cursor-pointer text-green-700">
                            I Agree & Proceed
                          </label>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                  
                  <div className="flex gap-4 mt-6">
                    <Button variant="outline" onClick={() => setCurrentStep(1)}>
                      Back
                    </Button>
                    <Button 
                      variant="hero" 
                      size="lg" 
                      className="flex-1"
                      onClick={handleStep2Submit}
                      disabled={!allPoliciesAgreed}
                    >
                      Proceed to Payment <ChevronRight className="h-5 w-5 ml-2" />
                    </Button>
                  </div>
                  
                  {!allPoliciesAgreed && (
                    <p className="text-sm text-amber-600 mt-4 text-center">
                      ⚠️ You must agree to all 4 sections to enable the payment button
                    </p>
                  )}
                </div>
              )}

              {/* Step 3: Payment */}
              {currentStep === 3 && (
                <div className="bg-card rounded-2xl border shadow-card p-8">
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                    <CreditCard className="h-6 w-6 text-primary" />
                    Step 3: Payment
                  </h2>
                  
                  <div className="bg-muted/30 rounded-xl p-6 mb-6">
                    <h3 className="font-semibold text-lg text-foreground mb-4">Order Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Course</span>
                        <span className="font-medium">{selectedCourse?.label}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Category</span>
                        <span>{selectedCourse?.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Name</span>
                        <span>{formData.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Email</span>
                        <span>{formData.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Mobile</span>
                        <span>{formData.mobile}</span>
                      </div>
                      <div className="border-t pt-3 mt-3">
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total Amount</span>
                          <span className="text-primary">₹{selectedCourse?.price.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-amber-800">
                      <strong>Note:</strong> This payment is for evaluation/training/placement support services. 
                      Fees are non-refundable under any circumstances. Payment does not guarantee job placement.
                    </p>
                  </div>
                  
                  <div className="flex gap-4">
                    <Button variant="outline" onClick={() => setCurrentStep(2)}>
                      Back
                    </Button>
                    {/* <Button 
                      variant="hero" 
                      size="lg" 
                      className="flex-1"
                      onClick={handlePaymentGuard}
                     disabled={isProcessingPayment || isAlreadyRegistered}
                    >
                      {isProcessingPayment ? (
                        <>Processing...</>
                      ) : (
                        <>Pay ₹{selectedCourse?.price.toLocaleString()} <ChevronRight className="h-5 w-5 ml-2" /></>
                      )}
                    </Button> */}
                    <Button 
                      variant="hero" 
                      size="lg" 
                      className="flex-1"
                      onClick={handlePaymentGuard}
                      disabled={isProcessingPayment || isAlreadyRegistered} // <--- Disable if already registered
                    >
                      {isAlreadyRegistered ? "Already Enrolled" : isProcessingPayment ? "Processing..." : "Pay Now"}
                    </Button>
                  </div>
                  
                  <p className="text-xs text-muted-foreground text-center mt-4">
                    Secured by Razorpay • 256-bit SSL Encryption
                  </p>
                </div>
              )}

              {/* Step 4: Success / Dashboard */}
              {currentStep === 4 && (
                <div className="bg-card rounded-2xl border shadow-card p-8 text-center">
                  <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-6">
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                  </div>
                  
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
                    Enrollment Successful! 🎉
                  </h2>
                  
                  <p className="text-muted-foreground mb-6">
                    Your payment has been processed and your enrollment is confirmed. 
                    An invoice has been sent to <strong>{formData.email}</strong>.
                  </p>
                  
                  <div className="bg-muted/30 rounded-xl p-6 mb-6 text-left">
                    <h3 className="font-semibold text-lg text-foreground mb-4">Invoice Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Invoice No.</span>
                        {/* <span className="font-mono">SNX-{Date.now().toString().slice(-8)}</span> */}
                        <span className="font-mono">{invoiceNo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Course</span>
                        <span>{selectedCourse?.label}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount Paid</span>
                        <span className="font-semibold text-green-600">₹{selectedCourse?.price.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date</span>
                        <span>{new Date().toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
                      <p><strong>Note:</strong> This payment is for evaluation/training/placement support services. 
                      Fees are non-refundable under any circumstances. Payment does not guarantee job placement.
                      Subject to AADHYRA INNOVATIONS PVT LTD policies agreed digitally.</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => {
                        console.log("Debug:", { formData, selectedCourse, invoiceNo });
                        generateInvoice(formData, selectedCourse, invoiceNo);
                      }}
                    >
                      <Download className="mr-2 h-4 w-4" /> 
                      Download Invoice (PDF)
                    </Button>
                    <Button variant="hero" size="lg" className="flex-1" onClick={handleGoToDashboard}>
                      <LayoutDashboard className="h-5 w-5 mr-2" />
                      Go to Dashboard
                    </Button>
                  </div>
                </div>
              )}
              
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ApplyPage;
