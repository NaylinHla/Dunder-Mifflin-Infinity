function ContactUs() {
    return (
        <div className="hero bg-base-200 p-2 sm:p-5 md:p-6 lg:p-8">
            <div className="hero-content flex-col lg:flex-row">
                <img
                    src="https://i.iheart.com/v3/re/new_assets/5f9acbf26e25de06d805edf7?ops=contain(1480,0)"
                    className="max-w-xs sm:max-w-sm lg:max-w-md rounded-lg shadow-2xl mb-4 lg:mb-0 lg:mr-6"
                    alt="Contact Us"
                />
                <div className="flex-1">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">Contact Us</h1>
                    <p className="py-2 text-sm sm:text-base lg:text-lg">
                        If you have any difficulties or problems with either your product or the service you have
                        received, don't hesitate to reach out and we
                        shall do our utmost to relieve and fix whatever might have gone wrong to the best extent of our
                        abilities.
                    </p>
                    <p className="mt-4 text-sm sm:text-base lg:text-lg">
                        <strong>Email:</strong> Info@DunderMifflinInfinity.com
                        <br/>
                        <strong>Tel:</strong> (212) 555-6733
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ContactUs;