export interface HRTaskSeed {
  id: string;
  number: number;
  title: string;
  shortTitle: string;
  videoUrl: string;
  paragraph: string;
  steps: string[];
  durationDays: number;
  payout: string;
  proofRequirements: {
    candidates: { label: string; placeholder: string };
    payment: { label: string; required: boolean };
    notes: { label: string; placeholder: string };
  };
}

export const HR_TASKS: HRTaskSeed[] = [
  {
    id: "task-1-course-hiring",
    number: 1,
    title: "TASK 1 — Mandatory Course Hiring",
    shortTitle: "Course Hiring",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder video
    paragraph:
      "Promote AADHYRA internship programs, training courses, and placement programs. Share posters, do WhatsApp promotions, follow-up calls, and lead generation. You must achieve a minimum of 2 admissions to successfully complete this task and unlock Task 2.",
    steps: [
      "Phase 1 (Day 1-5): Complete Training & Orientation",
      "Phase 2 (Day 6-15): Task Execution & Lead Generation",
      "Share posters and promotional materials in WhatsApp and social media",
      "Follow up with leads and coordinate their joining process",
      "Achieve minimum 2 admissions and submit their details below",
    ],
    durationDays: 15,
    payout: "Beginner: ₹1,000 – ₹3,000 | Average: ₹4,000 – ₹8,000",
    proofRequirements: {
      candidates: {
        label: "Admissions Generated (Min 2 required)",
        placeholder: "1. Candidate Name (Course Name)\n2. Candidate Name (Course Name)",
      },
      payment: { label: "Payment Screenshots (Combine into one file/PDF)", required: true },
      notes: { label: "Lead Generation Strategy Used", placeholder: "e.g., WhatsApp groups, LinkedIn outreach..." },
    },
  },
  {
    id: "task-2-choose-option",
    number: 2,
    title: "TASK 2 — Connect Specialization (Choose ONE)",
    shortTitle: "Specialization",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    paragraph:
      "For Task 2, you must choose and execute ANY ONE of the following connect options:\n\nOption A – HR Internship Hiring (Hire interns under you)\nOption B – Employer Connect (Bring companies for placements)\nOption C – Freelancing Project Connect (Bring client projects)\nOption D – Health Connect (Hospital partnerships/nursing admissions)\n\nExecute Phase 3 (Day 16-25): Hiring / Conversion / Coordination for your chosen option.",
    steps: [
      "Select your preferred Connect Option (A, B, C, or D)",
      "Reach out to target audience (interns, employers, clients, or hospitals)",
      "Successfully close the required targets for your chosen domain",
      "Collect confirmation (emails, MoUs, or payment screenshots)",
      "Submit the proof below to proceed to the final task",
    ],
    durationDays: 10,
    payout: "Best Performer: Up to ₹10,000 – ₹20,000+",
    proofRequirements: {
      candidates: {
        label: "Selected Option & Results",
        placeholder: "Option B - Employer Connect\nCompany: TechCorp Ltd\nContact: HR Manager name...",
      },
      payment: { label: "Proof of Connect (Email screenshot, Agreement, etc)", required: true },
      notes: { label: "Execution Details", placeholder: "How did you close this connect?" },
    },
  },
  {
    id: "task-3-team-contribution",
    number: 3,
    title: "TASK 3 — Team Contribution & Final Evaluation",
    shortTitle: "Team Contribution",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    paragraph:
      "Phase 4 (Day 26-30): Final Target Completion & Evaluation. In this final task, you will be evaluated on your daily reporting, team coordination, meeting participation, and how well you supported new interns. Complete your final reports to graduate and receive your internship benefits.",
    steps: [
      "Ensure all daily reporting logs are complete",
      "Participate actively in final evaluation meetings",
      "Support and guide new interns joining the program",
      "Submit your consolidated 30-day performance report",
      "Claim your Certificate, Experience Letter, and Job Opportunities",
    ],
    durationDays: 5,
    payout: "Full-Time Job Opportunity / Team Leader Role",
    proofRequirements: {
      candidates: {
        label: "Team Contribution Summary",
        placeholder: "Helped 3 new interns onboard. Attended all daily syncs...",
      },
      payment: { label: "Final Performance Report (PDF)", required: true },
      notes: { label: "Internship Feedback", placeholder: "What did you learn? How can we improve?" },
    },
  },
];

export const TASK_GRACE_HOURS_AFTER_EXPIRY = 0; // strict: missed = restart from Task 1