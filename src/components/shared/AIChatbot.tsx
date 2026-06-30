import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  Briefcase,
  BookOpen,
  GraduationCap,
  IndianRupee,
  Building2,
  Clock,
  ArrowRight,
  Minimize2,
} from "lucide-react";
import { Link } from "react-router-dom";

interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
  links?: { label: string; to: string }[];
  timestamp: Date;
}

const quickTopics = [
  { label: "Placement Process", icon: Briefcase },
  { label: "Salary Expectations", icon: IndianRupee },
  { label: "Course Fees", icon: BookOpen },
  { label: "Internship Info", icon: GraduationCap },
  { label: "Company Info", icon: Building2 },
  { label: "Job Openings", icon: Briefcase },
];

// Rule-based intelligent response system
const getResponse = (query: string): { content: string; links?: { label: string; to: string }[] } => {
  const q = query.toLowerCase().trim();

  // Placement / Hiring Process
  if (q.match(/placement|placed|hiring|process|interview|assessment|round/)) {
    return {
      content:
        "Our hiring process includes 3 interview rounds:\n\n" +
        "1️⃣ **Round 1 — Technical MCQ** (Proctored)\n" +
        "2️⃣ **Round 2 — Programming/Practical**\n" +
        "3️⃣ **Round 3 — AI HR Interview**\n\n" +
        "After all rounds, results are processed within 48 hours. Shortlisted candidates receive a congratulations email with next steps.\n\n" +
        "📋 Evaluation Fee: ₹300 (Fresher) | ₹700 (Experienced)",
      links: [
        { label: "View Job Openings", to: "/career" },
        { label: "Apply Now", to: "/apply" },
      ],
    };
  }

  // Salary
  if (q.match(/salary|package|lpa|ctc|compensation|pay|stipend/)) {
    return {
      content:
        "💰 **Salary Range at AADHYRA Partners:**\n\n" +
        "• **Freshers**: ₹3 – ₹8 LPA\n" +
        "• **Experienced (1-3 yrs)**: ₹5 – ₹15 LPA\n" +
        "• **Senior (3+ yrs)**: ₹10 – ₹35 LPA\n\n" +
        "Average placement salary: **₹8 LPA**\n" +
        "Top placement salary: **₹35 LPA**\n\n" +
        "Internship stipend: ₹5,000 – ₹15,000/month",
      links: [
        { label: "Browse Jobs", to: "/career" },
        { label: "Explore Internships", to: "/internships" },
      ],
    };
  }

  // Job Openings
  if (q.match(/job|opening|vacancy|position|role|bde|bdm|sales|marketing|counselor|counsellor/)) {
    return {
      content:
        "📋 **Current Job Openings:**\n\n" +
        "• Business Development Executive\n" +
        "• Business Development Manager\n" +
        "• Academic Counselor\n" +
        "• Career Counsellor\n" +
        "• Sales Executive\n" +
        "• Sales Manager\n" +
        "• Sales & Marketing\n\n" +
        "All positions offer hybrid mode, incentives, and career growth opportunities.\n\n" +
        "🎯 We also have IT, HR, Design, and Nursing positions available!",
      links: [
        { label: "View All Jobs", to: "/career" },
        { label: "Apply Now", to: "/apply" },
      ],
    };
  }

  // Internship
  if (q.match(/internship|intern|training|learn|practice|project/)) {
    return {
      content:
        "🎓 **AADHYRA Internship Benefits:**\n\n" +
        "✅ Live Projects with real companies\n" +
        "✅ Internship Certificate\n" +
        "✅ Performance-based Stipend (₹5K–₹15K/month)\n" +
        "✅ Full-time Opportunity after internship\n" +
        "✅ Career Growth & Mentorship\n" +
        "✅ Industry Experience across IT, HR, Marketing, Design\n\n" +
        "Duration: 1–6 months | Mode: WFH / Hybrid / Bangalore",
      links: [
        { label: "Browse Internships", to: "/internships" },
        { label: "Enroll Now", to: "/internships/enroll" },
      ],
    };
  }

  // Courses
  if (q.match(/course|program|curriculum|learn|skill|training|class|module/)) {
    return {
      content:
        "📚 **AADHYRA Training Programs:**\n\n" +
        "🖥️ **IT**: Java Full Stack, Python, AI/ML, Data Science, Cloud, Cyber Security\n" +
        "👥 **HR**: Generalist, Recruiter, Payroll, Talent Acquisition\n" +
        "📱 **Marketing**: SEO, Google Ads, Social Media, Content\n" +
        "🎨 **Design**: Photoshop, Illustrator, UI/UX, Branding\n" +
        "🏥 **Nursing**: Clinical Training, ICU, Patient Care\n\n" +
        "💡 **Special Offers:**\n" +
        "• 50% Scholarship on IT courses (₹40,000 → ₹19,999)\n" +
        "• Free ML Course for early enrollments\n" +
        "• Generative AI Course available",
      links: [
        { label: "Browse Courses", to: "/courses" },
        { label: "Apply Now", to: "/apply" },
      ],
    };
  }

  // Fees
  if (q.match(/fee|cost|price|charge|amount|payment|afford|discount|scholarship|offer/)) {
    return {
      content:
        "💳 **Fee Structure:**\n\n" +
        "**Courses:**\n" +
        "• IT Courses: ~~₹40,000~~ → ₹19,999 (50% Scholarship)\n" +
        "• HR Courses: ₹5,999\n" +
        "• Marketing/Design: ₹19,999\n" +
        "• Nursing: ₹20,999\n\n" +
        "**Evaluation Fee (Job/Internship):**\n" +
        "• Fresher: ₹300\n" +
        "• Experienced: ₹700\n\n" +
        "🎁 Free ML Course available for select students!\n" +
        "💰 Payment via Razorpay (UPI, Cards, Net Banking)",
      links: [
        { label: "Enroll Now", to: "/apply" },
        { label: "View Pricing", to: "/courses" },
      ],
    };
  }

  // Company info
  if (q.match(/company|aadhyra|about|who|what|organization|talent|tech partner|health|lab/)) {
    return {
      content:
        "🏢 **AADHYRA INNOVATIONS PVT LTD** operates 4 verticals:\n\n" +
        "🔍 **AADHYRA TALENTS CONECT** — AI-Powered Recruitment Platform (like Apna)\n" +
        "💻 **AADHYRA TECH PARTNER** — Freelancing Marketplace (like Upwork)\n" +
        "🏥 **AADHYRA HEALTH CONECT** — AI Healthcare & Telemedicine\n" +
        "🧠 **AADHYRA LAB** — AI Project Builder (like Lovable)\n\n" +
        "We've placed 5,000+ students, partnered with 500+ companies, and maintain a 95% placement rate.",
      links: [
        { label: "About Us", to: "/about" },
        { label: "Our Platforms", to: "/placement" },
      ],
    };
  }

  // Eligibility
  if (q.match(/eligibl|qualify|requirement|who can|can i|age|education|background/)) {
    return {
      content:
        "📝 **Eligibility Criteria:**\n\n" +
        "**For Courses & Internships:**\n" +
        "• 12th Pass / Graduate / Post Graduate\n" +
        "• No age limit\n" +
        "• All backgrounds welcome (Arts, Science, Commerce, Engineering)\n\n" +
        "**For Jobs:**\n" +
        "• Fresher (0-1 year) or Experienced (1+ years)\n" +
        "• Domain-specific skills preferred but not mandatory\n" +
        "• Good communication skills\n\n" +
        "**For Ambassador Program:**\n" +
        "• Currently enrolled in any college\n" +
        "• Active on social media",
      links: [
        { label: "Apply Now", to: "/apply" },
        { label: "Ambassador Program", to: "/student-ambassador" },
      ],
    };
  }

  // Duration
  if (q.match(/duration|how long|time|period|month|week|year|schedule/)) {
    return {
      content:
        "⏰ **Program Durations:**\n\n" +
        "**Courses:**\n" +
        "• IT Courses: 3–6 months\n" +
        "• HR Courses: 2–3 months\n" +
        "• Marketing: 1–4 months\n" +
        "• Design: 1–3 months\n" +
        "• Nursing: 2 months – 3 years\n\n" +
        "**Internships:** 1–6 months\n" +
        "**Interview Process:** 3–5 days (after evaluation fee)\n" +
        "**Ambassador Program:** Ongoing (min 3 months commitment)",
      links: [
        { label: "Browse Courses", to: "/courses" },
        { label: "Internships", to: "/internships" },
      ],
    };
  }

  // Certificate
  if (q.match(/certificate|certif|verify|credential|proof/)) {
    return {
      content:
        "🏆 **Certifications:**\n\n" +
        "All programs include industry-recognized certificates:\n" +
        "• Course Completion Certificate\n" +
        "• Internship Certificate\n" +
        "• Project Experience Certificate\n" +
        "• Ambassador Experience Certificate\n\n" +
        "All certificates are verifiable online through our certificate verification portal.",
      links: [
        { label: "Verify Certificate", to: "/verify" },
        { label: "Browse Courses", to: "/courses" },
      ],
    };
  }

  // Ambassador
  if (q.match(/ambassador|represent|campus|refer|referral|earn/)) {
    return {
      content:
        "🎓 **Student Ambassador Program:**\n\n" +
        "**Benefits:**\n" +
        "• Experience Certificate\n" +
        "• Incentives (₹200–₹2,000 per referral)\n" +
        "• Cashback on own enrollments\n" +
        "• Full-time job opportunity\n" +
        "• Free Course Access\n" +
        "• Internship Sponsorship\n\n" +
        "**Tasks:** Join communities, promote programs, refer students, earn rewards.\n" +
        "Top ambassadors earn ₹25,000+/month!",
      links: [
        { label: "Join Ambassador Program", to: "/student-ambassador" },
      ],
    };
  }

  // Greeting
  if (q.match(/^(hi|hello|hey|good|namaste|hola|greet)/)) {
    return {
      content:
        "👋 Hello! Welcome to AADHYRA INNOVATIONS PVT LTD!\n\n" +
        "I'm your AI Career Assistant. I can help you with:\n\n" +
        "🎯 Placement & Job opportunities\n" +
        "💰 Salary expectations\n" +
        "📚 Course information & fees\n" +
        "🎓 Internship programs\n" +
        "🏢 Company information\n" +
        "📋 Eligibility & duration\n\n" +
        "What would you like to know?",
      links: [
        { label: "Browse Jobs", to: "/career" },
        { label: "View Courses", to: "/courses" },
      ],
    };
  }

  // Help / Default
  return {
    content:
      "I'd be happy to help! Here are the topics I can assist you with:\n\n" +
      "🎯 **Placement Process** — How our 3-round interview works\n" +
      "💰 **Salary & Stipend** — Expected packages and internship stipends\n" +
      "📋 **Job Openings** — Current positions at AADHYRA\n" +
      "🎓 **Internships** — Available programs and benefits\n" +
      "📚 **Courses** — Training programs, fees & scholarships\n" +
      "🏢 **Company Info** — About AADHYRA's 4 verticals\n" +
      "📝 **Eligibility** — Who can apply\n" +
      "⏰ **Duration** — Program timelines\n\n" +
      "Try asking something like: *\"What is the salary for freshers?\"* or *\"Tell me about internships\"*",
    links: [
      { label: "Apply Now", to: "/apply" },
      { label: "Contact Us", to: "/contact" },
    ],
  };
};

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "bot",
      content:
        "👋 Hi! I'm AADHYRA's AI Career Assistant.\n\nI can help you with placements, courses, internships, salary info, and more. What would you like to know?",
      links: [
        { label: "View Courses", to: "/courses" },
        { label: "Browse Jobs", to: "/career" },
      ],
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate typing delay for natural feel
    setTimeout(() => {
      const response = getResponse(userMsg.content);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: response.content,
        links: response.links,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600 + Math.random() * 400);
  };

  const handleQuickTopic = (topic: string) => {
    setInput(topic);
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: topic,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const response = getResponse(topic);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: response.content,
        links: response.links,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
      setInput("");
    }, 600 + Math.random() * 400);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center group hover:scale-105"
        aria-label="Open AI Assistant"
      >
        <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
        {/* Pulse animation */}
        <span className="absolute h-full w-full rounded-full bg-primary animate-ping opacity-20" />
      </button>
    );
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50 bg-card rounded-2xl shadow-xl border w-72 overflow-hidden">
        <button
          onClick={() => setIsMinimized(false)}
          className="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors"
        >
          <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <Bot className="h-4 w-4" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-foreground">AI Assistant</p>
            <p className="text-xs text-muted-foreground">Click to expand</p>
          </div>
          <X
            className="h-4 w-4 text-muted-foreground hover:text-foreground"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
              setIsMinimized(false);
            }}
          />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] bg-card rounded-2xl shadow-2xl border overflow-hidden flex flex-col" style={{ maxHeight: "min(600px, calc(100vh - 6rem))" }}>
      {/* Header */}
      <div className="gradient-hero text-primary-foreground p-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-heading font-semibold text-sm">AADHYRA AI Assistant</h3>
          <p className="text-xs text-primary-foreground/70 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400 inline-block" />
            Online — Ready to help
          </p>
        </div>
        <button
          onClick={() => setIsMinimized(true)}
          className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
          aria-label="Minimize chat"
        >
          <Minimize2 className="h-4 w-4" />
        </button>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
          aria-label="Close chat"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "bot" && (
                <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="h-4 w-4" />
                </div>
              )}
              <div className={`max-w-[85%] ${msg.role === "user" ? "order-first" : ""}`}>
                <div
                  className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-muted/50 text-foreground rounded-bl-md border"
                  }`}
                >
                  {msg.content.split("\n").map((line, i) => (
                    <span key={i}>
                      {line.replace(/\*\*(.*?)\*\*/g, "").includes("~~") ? (
                        <span dangerouslySetInnerHTML={{ __html: line.replace(/~~(.*?)~~/g, "<s>$1</s>").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\*(.*?)\*/g, "<em>$1</em>") }} />
                      ) : (
                        <span dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\*(.*?)\*/g, "<em>$1</em>") }} />
                      )}
                      {i < msg.content.split("\n").length - 1 && <br />}
                    </span>
                  ))}
                </div>
                {msg.links && msg.links.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {msg.links.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={() => setIsOpen(false)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
                      >
                        {link.label}
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    ))}
                  </div>
                )}
                <p className="text-[10px] text-muted-foreground mt-1 px-1">
                  {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
              {msg.role === "user" && (
                <div className="h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-2">
              <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4" />
              </div>
              <div className="bg-muted/50 rounded-2xl rounded-bl-md border px-4 py-3">
                <div className="flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Quick Topics */}
      {messages.length <= 2 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-muted-foreground mb-2">Quick topics:</p>
          <div className="flex flex-wrap gap-1.5">
            {quickTopics.map((topic) => {
              const Icon = topic.icon;
              return (
                <button
                  key={topic.label}
                  onClick={() => handleQuickTopic(topic.label)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors bg-card"
                >
                  <Icon className="h-3 w-3" />
                  {topic.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t bg-card">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
            className="flex-1 rounded-full border-muted-foreground/20 text-sm h-10"
            disabled={isTyping}
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="h-10 w-10 rounded-full"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground text-center mt-2">
          Powered by AADHYRA AI • Ask about courses, jobs, internships & more
        </p>
      </div>
    </div>
  );
};

export default AIChatbot;
