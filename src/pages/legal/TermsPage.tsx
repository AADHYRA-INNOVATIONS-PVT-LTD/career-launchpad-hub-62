import LegalPageLayout from "@/components/legal/LegalPageLayout";

const TermsPage = () => (
  <LegalPageLayout badge="Legal" title="Terms & Conditions" lastUpdated="April 2026">
    <p>
      Welcome to AADHYRA INNOVATIONS PVT LTD. By accessing or using our website, training programs, internships, placement
      services, freelancing marketplace (AI Tech Partner), healthcare services (AI Health Connect), AI tools (AADHYRA LAB), or any
      other product offered by Aadhyra Innovations (collectively, the "Services"), you agree to be bound by these Terms.
    </p>

    <h2>1. Eligibility</h2>
    <p>You must be at least 16 years old to use our Services. By using the platform you confirm you meet this requirement and that the information you provide is accurate and complete.</p>

    <h2>2. Accounts & Roles</h2>
    <ul>
      <li>Candidate / Student accounts (training, internships, placements)</li>
      <li>Employer / Project Owner accounts (job posting, hiring, project posting)</li>
      <li>Freelancer accounts (AI Tech Partner marketplace)</li>
      <li>Doctor / Nurse accounts (AI Health Connect)</li>
      <li>Administrator accounts (internal operations)</li>
    </ul>
    <p>You are responsible for safeguarding your password and for all activities under your account.</p>

    <h2>3. Training, Internships & Certifications</h2>
    <p>Course fees, durations, and curriculum are listed on each course page and may be updated from time to time. Certificates are issued only after meeting evaluation and attendance criteria.</p>

    <h2>4. Placement Services</h2>
    <p>We facilitate introductions between candidates and employers but do not guarantee placement, salary, role, or specific company. Evaluation/assessment fees (e.g., ₹300 fresher / ₹700 experienced) are non-refundable once the test is started.</p>

    <h2>5. Freelancing (AI Tech Partner)</h2>
    <p>AI Tech Partner connects freelancers and project owners. Project payments are routed through escrow. Aadhyra Innovations charges a service commission per transaction. Disputes are handled per our Refund & Dispute policy.</p>

    <h2>6. Healthcare (AI Health Connect)</h2>
    <p>AI Health Connect provides AI-assisted information and connects you to qualified professionals. AI-generated information (e.g., symptom checker output) is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment.</p>

    <h2>7. AADHYRA LAB</h2>
    <p>AADHYRA LAB generates project plans, code suggestions, resumes, and other content. You are responsible for reviewing, validating, and lawfully using AI-generated output.</p>

    <h2>8. Payments</h2>
    <p>Payments are processed via Razorpay or other PCI-DSS compliant gateways. All fees are inclusive of applicable taxes unless stated otherwise.</p>

    <h2>9. Prohibited Conduct</h2>
    <ul>
      <li>Posting false, misleading, or fraudulent information</li>
      <li>Harassing, abusing, or impersonating any user</li>
      <li>Reverse engineering, scraping, or attempting to break security</li>
      <li>Uploading malware or infringing content</li>
    </ul>

    <h2>10. Intellectual Property</h2>
    <p>All trademarks, logos, course content, and platform code remain the property of AADHYRA INNOVATIONS PVT LTD or its licensors.</p>

    <h2>11. Limitation of Liability</h2>
    <p>To the maximum extent permitted by law, Aadhyra Innovations shall not be liable for indirect, incidental, special, or consequential damages arising from use of the Services.</p>

    <h2>12. Governing Law</h2>
    <p>These Terms are governed by the laws of India. Disputes shall be subject to the exclusive jurisdiction of courts in Bangalore, Karnataka.</p>

    <h2>13. Changes</h2>
    <p>We may update these Terms from time to time. Continued use of the Services after changes constitutes acceptance.</p>

    <h2>14. Contact</h2>
    <p>For any questions about these Terms, please email <a href="mailto:legal@Aadhyra Innovations.com" className="text-primary underline">legal@Aadhyra Innovations.com</a>.</p>
  </LegalPageLayout>
);

export default TermsPage;
