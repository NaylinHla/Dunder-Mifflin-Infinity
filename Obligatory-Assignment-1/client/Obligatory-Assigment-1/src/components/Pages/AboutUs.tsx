function AboutUs() {
    return (
        <div className="hero bg-base-200 p-2 sm:p-5 md:p-6 lg:p-8">
            <div className="hero-content flex-col lg:flex-row">
                <img
                    src="https://m.media-amazon.com/images/M/MV5BODYyM2QxM2MtOGIzMy00N2RkLWI1ZjctMTFjNDcxNzYyNWEwXkEyXkFqcGc@._V1_.jpg"
                    className="max-w-xs sm:max-w-sm lg:max-w-md rounded-lg shadow-2xl mb-4 lg:mb-0 lg:mr-6"
                    alt="Dunder Mifflin Infinity"/>
                <div className="flex-1">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Dunder Mifflin Infinity</h1>
                    <p className="py-2 text-sm sm:text-base lg:text-lg">
                        Dunder Mifflin Infinity is our answer to the consumers demand for more specialized paper. We aim
                        to deliver quality products that will fulfill your every desire, whatever they may be.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default AboutUs;