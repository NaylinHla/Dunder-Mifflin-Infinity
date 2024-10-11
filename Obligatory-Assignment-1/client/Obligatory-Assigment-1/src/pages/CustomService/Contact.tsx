import ContactUs from "../../components/Pages/ContactUs.tsx";
import {Link} from "react-router-dom";


function Contact() {
    return (
        <div>

            <ContactUs/>

            <div className="flex justify-center mb-4">
                <Link to={"/customer-service"} className="btn btn-primary text-lg sm:text-base">
                    Go to Customer Service
                </Link>
            </div>
        </div>
    );
}

export default Contact;