import PageHeader from "../../components/PageHelpers/PageHeader.tsx";
import { Link } from "react-router-dom"; // Ensure you have this import for the Link component

function WhistleBlowingPolicy() {
    return (
        <div className="container mx-auto px-4 py-8">
            <PageHeader/>
            <h1 className="text-2xl font-bold mb-6">Whistleblowing Policy</h1>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
                <p className="mb-4">
                    Dunder Mifflin Infinity is committed to fostering a culture of transparency and accountability. This
                    Whistleblowing Policy provides guidance on how to report concerns regarding misconduct or unethical
                    behavior within the organization.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">2. Legal Framework</h2>
                <p className="mb-4">
                    In 2019, the US established a directive to protect whistleblowers. This directive imposes stricter
                    requirements on employers regarding the handling of reported cases and expands the categories of
                    individuals who can report violations within a company. If you report a potential violation, you are
                    protected under the Whistleblowing Directive and relevant national legislation.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">3. Purpose</h2>
                <p className="mb-4">
                    This policy aims to create an open and accountable culture that prevents misconduct and ensures that
                    any wrongdoings are handled appropriately. We expect all employees to uphold our standards of
                    honesty and integrity in accordance with applicable laws.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">4. Reporting Procedures</h2>
                <p className="mb-4">
                    If you have concerns regarding irregularities or misconduct within Dunder Mifflin Infinity, you can
                    report them through the following channels:
                </p>
                <ul className="list-disc list-inside mb-4">
                    <li>Contact our confidential hotline: (212) 555-2412.</li>
                    <li>Speak to your manager or supervisor.</li>
                    <li>Utilize our internal reporting channel in accordance with established procedures for current
                        employees.
                    </li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">5. Confidentiality</h2>
                <p className="mb-4">
                    All reports will be treated with the utmost confidentiality. Personal information about
                    whistleblowers will not be disclosed without consent unless required by law.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">6. Protection from Retaliation</h2>
                <p className="mb-4">
                    Dunder Mifflin Infinity will not tolerate any form of retaliation against individuals who report
                    concerns in good faith. Any instances of retaliation will be taken seriously and may lead to
                    disciplinary action.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">7. Contact Information</h2>
                <p className="mb-4">
                    For any inquiries related to whistleblowing or to report a concern, please:
                </p>
                <p className="mt-4">
                    Visit our <Link to={"/customer-service/contact-us"} className="text-blue-500 hover:underline">Contact
                    Us</Link> page for more information.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">8. Further Information</h2>
                <p className="mb-4">
                    For further information regarding the US Whistleblower Directive, you can visit the official page
                    on <a href="https://commission.europa.eu/aid-development-cooperation-fundamental-rights/your-rights-eu/protection-whistleblowers_en"
                          className="text-blue-500 hover:underline">usa.us</a>.
                </p>
            </section>

            <p className="mb-4">
                Updated on 24 December 2023.
            </p>

        </div>
    );
}

export default WhistleBlowingPolicy;
