import { SetStateAction, useState} from "react";
import PageHeader from "../../components/PageHelpers/PageHeader.tsx";

function FAQ() {
    const [activeIndex, setActiveIndex] = useState(null);

    const faqs = [
        {
            question: "What is Dunder Mifflin Infinity?",
            answer: "Dunder Mifflin Infinity is an online platform that provides customers with access to our full range of office products and services. We prioritize customer satisfaction and aim to make your shopping experience seamless and enjoyable."
        },
        {
            question: "How can I contact customer support?",
            answer: "You can reach our customer support team by visiting our Contact Us page, where you will find various contact methods including email and phone support."
        },
        {
            question: "What is your return policy?",
            answer: "Our return policy allows you to return items within 30 days of purchase for a full refund or exchange. Items must be in their original packaging and condition. Please visit our Return Policy page for more details."
        },
        {
            question: "How does your cookie policy work?",
            answer: "We use cookies to enhance your browsing experience and to analyze our website traffic. You can manage your cookie preferences through your browser settings. For more information, please refer to our Cookie Policy."
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept various payment methods including credit cards, debit cards, and online payment options such as PayPal. You can select your preferred payment method during the checkout process."
        },
        {
            question: "Where can I find more information?",
            answer: "For additional information, you can explore our website or check out our Help Center for more FAQs and resources."
        }
    ];

    const toggleAnswer = (index: number | SetStateAction<null>) => {
        // @ts-ignore
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <PageHeader />
            <h1 className="text-2xl font-bold mb-6">Frequently Asked Questions</h1>

            {faqs.map((faq, index) => (
                <section key={index} className="mb-4 border-b">
                    <h2
                        className="text-xl font-semibold cursor-pointer mb-2"
                        onClick={() => toggleAnswer(index)}
                    >
                        {faq.question}
                    </h2>
                    {activeIndex === index && (
                        <p className="mb-4">{faq.answer}</p>
                    )}
                </section>
            ))}
        </div>
    );
}

export default FAQ;
