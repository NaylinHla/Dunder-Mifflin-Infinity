import Picture2 from "../../../assets/Carousel_Assets/CarouselPicture2.png";
import {Link} from "react-router-dom";

function Chinese() {
    return (
        <div className="p-4">
            <div className="card card-side bg-base-100 shadow-xl flex flex-col sm:flex-row">
                <figure className="w-full sm:w-1/2">
                    <img src={Picture2} alt="Made by Chinese children" className="w-full h-auto"/>
                </figure>
                <div className="card-body w-full sm:w-1/2">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-5">
                        Made by Chinese children
                    </h1>
                    <p className="card-title text-lg sm:text-xl font-bold">
                        At Dunder Mifflin Infinity, we take pride in producing the finest paper—crafted with care by some of the most dedicated hands around!
                        Sure, some might call them kids, but we call them efficiency experts.
                        Why waste time on things like school or play when you can help fuel the paper industry?
                        With the natural sunlight streaming through our well-ventilated factories (those cracks really do the trick),
                        we ensure that every sheet is questionably sourced but undeniably smooth.
                        Who needs "ethical standards" when your printer runs this flawlessly?
                        😉 #PaperPerfection #MaybeNotEthicalButSmooth
                    </p>
                    <div className="mt-5">
                        <Link to={"/home"}>
                            <button className="btn btn-primary">Return to Home</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Chinese;