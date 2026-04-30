// Pre-seeded HR Internship Tasks — sequential lock flow
// Task-1 must be completed (with proof + payment screenshot) to unlock Task-2, etc.

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
    title: "Task 1 — Course Hiring (IT / Non-IT)",
    shortTitle: "Course Hiring",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    paragraph:
      "In this first task, your goal is simple: bring real candidates who enroll in any AADHYRA course — IT or Non-IT (Nursing, HR, Marketing, Graphic Design). Reach out to your network: friends, college groups, LinkedIn, WhatsApp communities. Share the AADHYRA course page and explain the benefits — placement, internship, certification. Once a candidate joins and pays the course fee, collect their full name and the payment screenshot. Submit them below to unlock Task 2.",
    steps: [
      "Watch the explainer video above carefully",
      "Share AADHYRA course links with your network",
      "Convince at least 2 candidates to enroll in any course",
      "Collect their full names + payment screenshot",
      "Upload proof here to unlock Task 2",
    ],
    durationDays: 15,
    payout: "₹500 per candidate joined",
    proofRequirements: {
      candidates: {
        label: "Joined Candidate Names",
        placeholder: "1. Ravi Kumar\n2. Priya Sharma\n3. ...",
      },
      payment: { label: "Payment Screenshot (proof of enrollment)", required: true },
      notes: { label: "Additional Notes", placeholder: "Course chosen, batch, contact, etc." },
    },
  },
  {
    id: "task-2-hr-hiring",
    number: 2,
    title: "Task 2 — HR Internship Hiring",
    shortTitle: "HR Hiring",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    paragraph:
      "Now you've proven you can hire candidates. In Task 2, hire fresh HR Interns — people who will work under YOU, doing Task 1 (course hiring). The more HR interns you bring in, the bigger your team grows. Pitch the AADHYRA HR internship: real work, stipend, certificate, experience letter. Once they register and pay the HR internship fee, collect their names and payment proof here.",
    steps: [
      "Watch the team-building video above",
      "Promote the AADHYRA HR Internship program",
      "Recruit at least 3 fresh HR interns into your team",
      "Collect each new HR intern's name + payment screenshot",
      "Submit proof to unlock Task 3 (Team Handling)",
    ],
    durationDays: 20,
    payout: "₹1,000 per HR intern joined + ₹500 override per their conversion",
    proofRequirements: {
      candidates: {
        label: "Hired HR Intern Names",
        placeholder: "1. Anjali Verma\n2. Suresh Reddy\n3. ...",
      },
      payment: { label: "Payment Screenshot (proof of HR intern enrollment)", required: true },
      notes: { label: "Team Notes", placeholder: "Contact details, joining date, etc." },
    },
  },
  {
    id: "task-3-team-handling",
    number: 3,
    title: "Task 3 — Team Handling (Lead Your HR Interns)",
    shortTitle: "Team Handling",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    paragraph:
      "Final task — lead the HR interns YOU hired in Task 2. Each one must complete Task 1 (course hiring) and then Task 2 (HR hiring) under your guidance. You earn an override commission on every candidate THEY bring in. Track their progress, do daily standups, motivate them. Submit a weekly report with each intern's name, their performance, and total candidates converted by your team.",
    steps: [
      "Watch the leadership video above",
      "Ensure each of your HR interns starts and completes Task 1",
      "Guide them through Task 2 (HR hiring)",
      "Track total team conversions weekly",
      "Submit weekly team report + payment screenshots collected by team",
    ],
    durationDays: 30,
    payout: "₹2,000 base + ₹300 override per team-converted candidate",
    proofRequirements: {
      candidates: {
        label: "Your Team's Performance Report",
        placeholder:
          "HR Intern 1: Anjali — 5 course candidates, 2 HR interns hired\nHR Intern 2: Suresh — 3 course candidates, 1 HR intern hired\n...",
      },
      payment: { label: "Combined Payment Screenshot of all team conversions", required: true },
      notes: { label: "Leadership Notes", placeholder: "Challenges, wins, intern feedback..." },
    },
  },
];

export const TASK_GRACE_HOURS_AFTER_EXPIRY = 0; // strict: missed = restart from Task 1