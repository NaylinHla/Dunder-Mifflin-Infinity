import PageHeader from "../../components/PageHelpers/PageHeader.tsx";

function GDPRDataProtectionPolicy() {
    return (
        <div className="container mx-auto px-4 py-8">
            <PageHeader/>
            <h1 className="text-2xl font-bold mb-6">GDPR - Data Protection Policy</h1>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
                <p className="mb-4">
                    At Dunder Mifflin Infinity, we are committed to protecting and respecting your privacy. This policy
                    explains how we collect, use, and protect your personal data in compliance with the General Data
                    Protection Regulation (GDPR).
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">2. Information We Collect</h2>
                <p className="mb-4">
                    We may collect and process the following data about you:
                </p>
                <ul className="list-disc list-inside mb-4">
                    <li>Contact Information (e.g., name, email address)</li>
                    <li>Account Information (e.g., username, password)</li>
                    <li>Payment Information (e.g., credit card details)</li>
                    <li>Usage Data (e.g., information about how you use our website)</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">3. How We Use Your Information</h2>
                <p className="mb-4">
                    We use your personal data for the following purposes:
                </p>
                <ul className="list-disc list-inside mb-4">
                    <li>To provide and manage your account.</li>
                    <li>To process transactions and send you confirmations.</li>
                    <li>To communicate with you regarding your account and our services.</li>
                    <li>To comply with legal obligations.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">4. Your Rights</h2>
                <p className="mb-4">
                    Under the GDPR, you have several rights regarding your personal data, including:
                </p>
                <ul className="list-disc list-inside mb-4">
                    <li>The right to access your personal data.</li>
                    <li>The right to rectify inaccurate data.</li>
                    <li>The right to erase your personal data (right to be forgotten).</li>
                    <li>The right to restrict processing of your personal data.</li>
                    <li>The right to data portability.</li>
                    <li>The right to object to processing.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">5. Security of Your Data</h2>
                <p className="mb-4">
                    We take the security of your personal data seriously and implement appropriate technical and
                    organizational measures to protect it against unauthorized access, loss, or destruction.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">6. Data Retention</h2>
                <p className="mb-4">
                    We will retain your personal data only for as long as necessary to fulfill the purposes for which we
                    collected it, including for the purposes of satisfying any legal, accounting, or reporting
                    requirements.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">7. Cookies and Tracking Technologies</h2>
                <p className="mb-4">
                    We use cookies and similar tracking technologies to track the activity on our service and store
                    certain information. Cookies are files with small amounts of data which may include an anonymous
                    unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie
                    is being sent. However, if you do not accept cookies, you may not be able to use some portions of
                    our service.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">8. Third-Party Sharing</h2>
                <p className="mb-4">
                    We may share your information with third parties in the following situations:
                </p>
                <ul className="list-disc list-inside mb-4">
                    <li>With service providers to perform services on our behalf.</li>
                    <li>To comply with legal obligations.</li>
                    <li>To protect and defend our rights and property.</li>
                    <li>To prevent or investigate possible wrongdoing in connection with the service.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">9. Changes to This Policy</h2>
                <p className="mb-4">
                    We may update this Data Protection Policy from time to time. Any changes will be posted on this
                    page, and we encourage you to review it regularly.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-4">10. Summary</h2>
                <p className="mb-4">
                    In summary, your privacy is important to us, and we are committed to protecting your personal data.
                    We adhere to the principles of transparency, security, and user rights as outlined in the GDPR.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-4">11. Contact Us</h2>
                <p className="mb-4">
                    If you have any questions about this policy or our privacy practices, please contact us at:
                </p>
                <p>
                    <span className="font-semibold">Email:</span> gdpr@DunderMifflinInfinity.com
                </p>
                <p>
                    <span className="font-semibold">Phone:</span> (212) 555-6734
                </p>
            </section>
            <br></br>
            <p className="mb-4">
                Updated on 19 November 2022.
            </p>
        </div>
    );
}

export default GDPRDataProtectionPolicy;