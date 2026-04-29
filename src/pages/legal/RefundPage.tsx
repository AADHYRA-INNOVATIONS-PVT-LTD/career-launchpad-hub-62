import LegalPageLayout from "@/components/legal/LegalPageLayout";

const RefundPage = () => (
  <LegalPageLayout badge="Legal" title="Refund & Cancellation Policy" lastUpdated="April 2026">
    <p>
      We aim to be fair and transparent. The following terms apply to refunds and cancellations across our Services.
    </p>

    <h2>1. Course & Training Fees</h2>
    <ul>
      <li>Full refund within 7 days of enrolment if less than 10% of the course is consumed.</li>
      <li>50% refund within 14 days if less than 25% of the course is consumed.</li>
      <li>No refund after 14 days or after 25% of content is consumed.</li>
    </ul>

    <h2>2. Internship Programs</h2>
    <p>Internship participation fees are refundable within 7 days of joining if no tasks have been submitted.</p>

    <h2>3. Placement Evaluation Fees</h2>
    <p>Evaluation/assessment fees (Fresher ₹300 / Experienced ₹700) are <strong>non-refundable</strong> once the MCQ test has been started.</p>

    <h2>4. AADHYRA TECH PARTNER (Freelancing)</h2>
    <p>Project escrow funds are released per the agreed milestones. Refunds during disputes are governed by our Dispute Resolution policy. Platform service fees are non-refundable.</p>

    <h2>5. AADHYRA HEALTH CONNECT</h2>
    <ul>
      <li>Consultations cancelled at least 30 minutes before the slot are fully refundable.</li>
      <li>Lab tests cancelled before sample collection are fully refundable.</li>
      <li>AI checkup fees (e.g., symptom checker, stress detection) are non-refundable once the report is generated.</li>
    </ul>

    <h2>6. Project Marketplace Purchases</h2>
    <p>Digital project downloads are non-refundable once the source code or documentation has been downloaded.</p>

    <h2>7. Refund Processing</h2>
    <p>Approved refunds are processed within 7-10 business days to the original payment method.</p>

    <h2>8. How to Request</h2>
    <p>Email <a href="mailto:refunds@Aadhyra Innovations.com" className="text-primary underline">refunds@Aadhyra Innovations.com</a> with your order/transaction ID and reason. Our team will respond within 3 business days.</p>
  </LegalPageLayout>
);

export default RefundPage;
