import PageHeader from "../../components/PageHelpers/PageHeader.tsx";

function CookiePolicy() {
    return (
        <div className="container mx-auto px-4 py-8">
            <PageHeader/>
            <h1 className="text-2xl font-bold mb-6">Cookies</h1>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">1. What are Cookies?</h2>
                <p className="mb-4">
                    Cookies are small text files placed on your device by websites you visit. They are widely used to
                    make websites work more efficiently, as well as to provide information to the owners of the site.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">2. How We Use Cookies</h2>
                <p className="mb-4">
                    At Dunder Mifflin Infinity, we use cookies to enhance your experience on our website. The cookies
                    we use fall into the following categories:
                </p>
                <ul className="list-disc list-inside mb-4">
                    <li><strong>Essential Cookies:</strong> These cookies are necessary for the website to function and
                        cannot be switched off.
                    </li>
                    <li><strong>Performance Cookies:</strong> These cookies allow us to count visits and traffic sources
                        so we can measure and improve the performance of our site.
                    </li>
                    <li><strong>Functional Cookies:</strong> These cookies enable the website to provide enhanced
                        functionality and personalization.
                    </li>
                    <li><strong>Targeting Cookies:</strong> These cookies may be set through our site by our advertising
                        partners to build a profile of your interests and show you relevant ads on other sites.
                    </li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">3. Your Choices Regarding Cookies</h2>
                <p className="mb-4">
                    You can manage your cookie preferences through your browser settings. Most web browsers allow you to
                    refuse cookies or alert you when cookies are being sent. However, if you disable cookies, you may
                    not
                    be able to use the full functionality of our website.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">4. Third-Party Cookies</h2>
                <p className="mb-4">
                    In addition to our own cookies, we may also use various third-party cookies to report usage
                    statistics
                    of the Service and deliver advertisements on and through the Service. These third-party cookies are
                    governed
                    by their respective privacy policies.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-4">5. Changes to This Cookie Policy</h2>
                <p className="mb-4">
                    We may update our Cookie Policy from time to time. We will notify you of any changes by posting the
                    new
                    Cookie Policy on this page. You are advised to review this Cookie Policy periodically for any
                    changes.
                </p>
            </section>

            <p className="mb-4">
                Updated on 7 May 2023.
            </p>
        </div>
    );
}

export default CookiePolicy;
