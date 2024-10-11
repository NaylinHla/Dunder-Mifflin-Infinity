import CookiesImage from '/src/assets/customer-service/cta-ccc-cookies.avif';
import TermImage from '/src/assets/customer-service/cta-ccc-terms-conditions.avif';
import GDPRImage from '/src/assets/customer-service/cta-ccc-gdpr.avif';
import FAQImage from '/src/assets/customer-service/cta-ccc-faq.avif';
import OrderImage from '/src/assets/customer-service/cta-ccc-follow-order.avif';
import ContactImage from '/src/assets/customer-service/cta-ccc-contact-us.avif';
import {Link} from "react-router-dom";

function CustomService() {
    return (
        <div>
            <div className="bg-gray-100">
                <div className="container mx-auto mt-12 px-4 pb-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* First Card */}
                        <div className="card bg-base-100 shadow-md p-6 hover:bg-gray-200">
                            <figure>
                                <picture>
                                    <source media="(min-width: 768px)" srcSet={ContactImage}/>
                                    <img className="w-full h-auto object-contain" src={ContactImage}
                                         alt="Custom service icon"/>
                                </picture>
                            </figure>
                            <div className="card-body text-left">
                                <h2 className="card-title">Contact us</h2>
                                <p>
                                    Do you still lack answers to your questions? Then send us an email or call us.
                                </p>
                                <div className="card-actions justify-center mt-4">
                                    <Link to={"/customer-service/contact-us"} className="btn btn-neutral">
                                        Contact customer service
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Second Card */}
                        <div className="card bg-base-100 shadow-md p-6 hover:bg-gray-200">
                            <figure>
                                <picture>
                                    <source media="(min-width: 768px)" srcSet={OrderImage}/>
                                    <img className="w-full h-auto object-contain" src={OrderImage}
                                         alt="Order Tracking Icon"/>
                                </picture>
                            </figure>
                            <div className="card-body text-left">
                                <h2 className="card-title">Check your order</h2>
                                <p>
                                    Do you want a status on the delivery of your order? We help you with
                                    to see your package.
                                </p>
                                <div className="card-actions justify-center mt-4">
                                    <Link to={"/myOrders"}
                                          className="btn btn-neutral">
                                        Check orders
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Third Card */}
                        <div className="card bg-base-100 shadow-md p-6 hover:bg-gray-200">
                            <figure>
                                <picture>
                                    <source media="(min-width: 768px)" srcSet={FAQImage}/>
                                    <img className="w-full h-auto object-contain" src={FAQImage}
                                         alt="FAQ Icon"/>
                                </picture>
                            </figure>
                            <div className="card-body text-left">
                                <h2 className="card-title">Frequently asked questions (FAQ)</h2>
                                <p>
                                    Can't find what you're looking for? Take a look at our frequently
                                    asked questions and see if you can find the answer there.
                                </p>
                                <div className="card-actions justify-center mt-4">
                                    <Link to={"/customer-service/faq"} className="btn btn-neutral">
                                        Frequently asked questions
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="container mx-auto mt-12 px-4">
                        <h2 className="font-bold text-3xl mb-7">Terms and Conditions and Privacy Policy</h2>

                        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
                            {/* Tile 1 - Sales and Delivery Conditions */}
                            <li className="flex flex-col h-full snap-start bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-200">
                                <a target="_self" className="flex flex-col h-full"
                                   href="/customer-service/sales-and-delivery-conditions">
                                    <div className="flex-shrink-0">
                                        <picture>
                                            <source media="(min-width: 768px)" srcSet={TermImage}/>
                                            <img className="w-full h-auto object-contain" src={TermImage}
                                                 alt="Terms icon"/>
                                        </picture>
                                    </div>
                                    <div className="flex flex-col flex-grow justify-between p-4">
                                        <h3 className="font-bold text-2xl mb-2 leading-tight">Sales and Delivery Conditions</h3>
                                        <p className="mb-4 flex-grow">Here you will find detailed information about our
                                            sales and delivery conditions - both for business customers and private customers.</p>
                                        <span className="button button-tertiary text-xl inline-block">Sales and Delivery Conditions</span>
                                    </div>
                                </a>
                            </li>

                            {/* Tile 2 - GDPR */}
                            <li className="flex flex-col h-full snap-start bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-200">
                                <a target="_self" className="flex flex-col h-full"
                                   href="/customer-service/gdpr-data-protection-policy">
                                    <div className="flex-shrink-0">
                                        <picture>
                                            <source media="(min-width: 768px)" srcSet={GDPRImage}/>
                                            <img className="w-full h-auto object-contain" src={GDPRImage}
                                                 alt="GDPR icon"/>
                                        </picture>
                                    </div>
                                    <div className="flex flex-col flex-grow justify-between p-4">
                                        <h3 className="font-bold text-2xl mb-2 leading-tight">GDPR - Data Protection Policy</h3>
                                        <p className="mb-4 flex-grow">Want to know more about how we protect your information?</p>
                                        <span className="button button-tertiary text-xl inline-block">Data Protection Policy</span>
                                    </div>
                                </a>
                            </li>

                            {/* Tile 3 - Cookies */}
                            <li className="flex flex-col h-full snap-start bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-200">
                                <a target="_self" className="flex flex-col h-full"
                                   href="/customer-service/cookie-policy">
                                    <div className="flex-shrink-0">
                                        <picture>
                                            <source media="(min-width: 768px)" srcSet={CookiesImage}/>
                                            <img className="w-full h-auto object-contain" src={CookiesImage}
                                                 alt="Cookies icon"/>
                                        </picture>
                                    </div>
                                    <div className="flex flex-col flex-grow justify-between p-4">
                                        <h3 className="font-bold text-2xl mb-2 leading-tight">Cookies</h3>
                                        <p className="mb-4 flex-grow">To make your shopping experience better, we use cookies.</p>
                                        <span className="button button-tertiary text-xl inline-block">Cookies</span>
                                    </div>
                                </a>
                            </li>

                            {/* Tile 4 - Whistleblowing */}
                            <li className="flex flex-col h-full snap-start bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-200">
                                <a target="_self" className="flex flex-col h-full"
                                   href="/customer-service/whistleblowing-policy">
                                    <div className="flex-shrink-0">
                                        <picture>
                                            <source media="(min-width: 768px)" srcSet={TermImage}/>
                                            <img className="w-full h-auto object-contain" src={TermImage}
                                                 alt="Whistleblowing icon"/>
                                        </picture>
                                    </div>
                                    <div className="flex flex-col flex-grow justify-between p-4">
                                        <h3 className="font-bold text-2xl mb-2 leading-tight">Whistleblowing in the Organization</h3>
                                        <p className="mb-4 flex-grow">Dunder Mifflin Infinity A/S is obliged to act with honesty and integrity.</p>
                                        <span
                                            className="button button-tertiary text-xl inline-block">Whistleblowing</span>
                                    </div>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CustomService;