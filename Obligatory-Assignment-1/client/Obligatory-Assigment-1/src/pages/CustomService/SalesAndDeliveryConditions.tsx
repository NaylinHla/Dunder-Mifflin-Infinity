import PageHeader from "../../components/PageHelpers/PageHeader.tsx";
import { Link } from "react-router-dom";

function SalesAndDeliveryConditions() {
    return (
        <div className="container mx-auto px-4 py-8">
            <PageHeader />
            <h1 className="text-2xl font-bold mb-6">Sales and Delivery Conditions</h1>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
                <p className="mb-4">
                    At Dunder Mifflin Infinity, we are committed to providing clear information regarding our sales and delivery conditions to ensure transparency and customer satisfaction.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">2. Sales Conditions</h2>
                <p className="mb-4">
                    We aim to deliver high-quality products to our customers. Please review the following terms before making a purchase.
                </p>
                <ul className="list-disc list-inside mb-4">
                    <li>All orders are subject to availability.</li>
                    <li>Prices may vary based on market conditions.</li>
                    <li>Payment must be completed prior to shipping.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">3. Delivery Conditions</h2>
                <p className="mb-4">
                    We provide reliable delivery options to ensure timely arrival of your orders. The following outlines our delivery conditions:
                </p>
                <ul className="list-disc list-inside mb-4">
                    <li>Delivery times may vary based on location.</li>
                    <li>We offer standard and expedited shipping options.</li>
                    <li>All delivery fees are calculated at checkout.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">4. Contact Information</h2>
                <p className="mb-4">
                    For any inquiries related to sales and delivery conditions, please:
                </p>
                <p className="mt-4">
                    Visit our <Link to={"/customer-service/contact-us"} className="text-blue-500 hover:underline">Contact Us</Link> page for more information.
                </p>
            </section>

            <p className="mb-4">
                Updated on 12 June 2024.
            </p>
        </div>
    );
}

export default SalesAndDeliveryConditions;
