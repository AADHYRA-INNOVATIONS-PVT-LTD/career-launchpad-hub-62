import LegalPageLayout from "@/components/legal/LegalPageLayout";

const CookiesPage = () => (
  <LegalPageLayout badge="Legal" title="Cookie Policy" lastUpdated="April 2026">
    <p>This policy explains how AADHYRA INNOVATIONS PVT LTD uses cookies and similar tracking technologies.</p>

    <h2>1. What Are Cookies?</h2>
    <p>Cookies are small text files stored on your device that help websites remember information about your visit.</p>

    <h2>2. Types of Cookies We Use</h2>
    <h3>Strictly Necessary</h3>
    <p>Required for login sessions, security, and core functionality. These cannot be disabled.</p>
    <h3>Performance & Analytics</h3>
    <p>Help us understand how the platform is used so we can improve it.</p>
    <h3>Functional</h3>
    <p>Remember preferences such as theme, language, and last-viewed course.</p>
    <h3>Marketing</h3>
    <p>Used to show you relevant content and measure campaign performance.</p>

    <h2>3. Third-Party Cookies</h2>
    <ul>
      <li>Supabase (authentication & session)</li>
      <li>Razorpay (payment processing)</li>
      <li>Google Analytics (site analytics)</li>
    </ul>

    <h2>4. Managing Cookies</h2>
    <p>You can control cookies through your browser settings. Disabling some cookies may affect site functionality.</p>

    <h2>5. Contact</h2>
    <p>Questions? Email <a href="mailto:privacy@Aadhyra Innovations.com" className="text-primary underline">privacy@Aadhyra Innovations.com</a>.</p>
  </LegalPageLayout>
);

export default CookiesPage;
