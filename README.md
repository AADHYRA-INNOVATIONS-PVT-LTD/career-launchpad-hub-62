# Aadhyra Career Launchpad Hub & Ecosystem

Welcome to the **Aadhyra Career Launchpad Hub** — a comprehensive, multi-vertical digital ecosystem designed to bridge the gap between education, healthcare, and professional freelancing.

This platform houses four massive pillars under one roof:

## 🌐 The Aadhyra Ecosystem

### 1. Aadhyra Talent Connect (EdTech & Recruitment)
- **Student Learning Portal (LMS):** 20+ professional courses across IT, HR, Marketing, Design, and Nursing. Features Netflix-style video playback, PDF notes, and automated quizzes.
- **Mock Interviews & Assessments:** AI-driven interview evaluation and entrance exams.
- **Employer Portal:** Pan-India job posting, candidate tracking, and AI-driven shortlisting.
- **University Relations (TPO):** Direct registration portal for colleges to onboard their students for campus drives.

### 2. Aadhyra Tech Partner (Freelance Marketplace)
- **Freelancer Dashboard:** Secure project bidding, portfolio showcases, and profile verification.
- **Project Owner Dashboard:** Post technical projects, evaluate bids, and manage escrow payments securely.

### 3. Aadhyra Health Connect (Telemedicine & AI Healthcare)
- **AI Health Checkups:** AI Symptom Checker, BMI, Stress Level, and Heart Rate analyzers protected by a secure Freemium/Paywall model.
- **Telemedicine:** 24/7 Online doctor consultations, pharmacy orders, and lab test bookings.
- **Doctor & Patient Portals:** Dedicated dashboards for managing appointments and digital prescriptions.

### 4. Aadhyra Lab (AI Incubation)
- **AI Project Builder:** Instantly generate tech stacks and code scaffolding from ideas.
- **Career AI:** Automated resume evaluation and career path insights.

---

## 🛠️ Technology Stack

This application is built with modern, high-performance web technologies:

- **Frontend Framework:** React 18 + Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS + [shadcn-ui](https://ui.shadcn.com/)
- **Backend & Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth (Multi-role support)
- **Serverless Compute:** Supabase Edge Functions (Deno)
- **Payments:** Razorpay API Integration

---

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js (v18+) and npm installed.

### 1. Clone & Install
```bash
git clone https://github.com/SushAN766/career-launchpad-hub-62.git
cd career-launchpad-hub-62
npm install
```

### 2. Environment Variables
Ensure your `.env` file is present in the root directory with your Supabase and Razorpay credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_RAZORPAY_KEY_ID=your_razorpay_test_or_live_key
```

### 3. Start Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:8080` (or the port specified in your terminal).

---

## 💳 Payment Architecture
The platform securely integrates Razorpay to handle course enrollments, premium AI health queries, and employer premium features. 
- Order generation is handled securely via **Supabase Edge Functions** (`create-razorpay-order`) to prevent client-side tampering.
- Post-payment verification (`verify-razorpay-payment`) automatically provisions database access (e.g., unlocking a course or AI tool).

---

## 👨‍💻 Contributing & Maintenance
Changes pushed to the `main` branch can be configured to auto-deploy via platforms like Vercel or Netlify. When adding new courses or tools, ensure you update the respective Supabase SQL tables (`courses`, `course_modules`, etc.).

*Built by Aadhyra Innovations Pvt Ltd.*
