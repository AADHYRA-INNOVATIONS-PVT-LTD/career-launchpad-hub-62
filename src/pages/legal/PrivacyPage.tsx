import LegalPageLayout from "@/components/legal/LegalPageLayout";

const PrivacyPage = () => (
  <LegalPageLayout badge="Legal" title="Privacy Policy" lastUpdated="April 2026">
    <p>
      Shiksha Nex Technologies ("we", "us") respects your privacy. This policy explains what data we collect, how we use it,
      and the choices you have.
    </p>

    <h2>1. Information We Collect</h2>
    <ul>
      <li>Account info: name, email, phone, qualifications, photo</li>
      <li>Profile info: skills, resume, portfolio, bank account (for payouts)</li>
      <li>Health data: symptoms, age, gender (only when you use Health Connect)</li>
      <li>Usage data: pages visited, course progress, interview scores</li>
      <li>Device data: browser, IP, device type</li>
      <li>Webcam / mic data: only during proctored interviews, with your consent</li>
    </ul>

    <h2>2. How We Use Your Data</h2>
    <ul>
      <li>To provide training, certification, placement, freelancing, and healthcare services</li>
      <li>To match you with jobs, projects, doctors, or courses</li>
      <li>To process payments and payouts</li>
      <li>To improve our AI models and platform features</li>
      <li>To send important transactional notifications</li>
    </ul>

    <h2>3. AI & Third-Party Processing</h2>
    <p>We use Lovable AI (Google Gemini) for AI features such as the symptom checker, AI Lab project generation, mock interview evaluation, and resume building. Your prompts and responses are processed securely.</p>

    <h2>4. Sharing of Data</h2>
    <p>We share your data only with:</p>
    <ul>
      <li>Employers / Project Owners you apply to (with your consent)</li>
      <li>Doctors / Nurses you book consultations with</li>
      <li>Payment processors (Razorpay) for transactions</li>
      <li>Cloud infrastructure providers (Supabase / AWS)</li>
    </ul>
    <p>We do not sell your personal data.</p>

    <h2>5. Data Retention</h2>
    <p>We retain your data while your account is active and as required for legal, accounting, or operational purposes.</p>

    <h2>6. Security</h2>
    <p>We implement industry-standard security: encryption in transit, role-based access controls, RLS on all tables, and audit logs.</p>

    <h2>7. Your Rights</h2>
    <ul>
      <li>Access, correct, or delete your personal data</li>
      <li>Withdraw consent for non-essential processing</li>
      <li>Export your data in a portable format</li>
      <li>Lodge a complaint with the relevant data protection authority</li>
    </ul>

    <h2>8. Children's Privacy</h2>
    <p>Our Services are not intended for children under 16.</p>

    <h2>9. Contact</h2>
    <p>For privacy questions or data requests, write to <a href="mailto:privacy@shikshanex.com" className="text-primary underline">privacy@shikshanex.com</a>.</p>
  </LegalPageLayout>
);

export default PrivacyPage;
