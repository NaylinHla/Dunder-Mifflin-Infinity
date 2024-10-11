import Picture4 from "../../../assets/Carousel_Assets/CarouselPicture4.png";
import {Link} from "react-router-dom";

function Productivity() {
    return (
        <div className="p-4">
            <div className="card card-side bg-base-100 shadow-xl flex flex-col sm:flex-row">
                <figure className="w-full sm:w-1/2">
                    <img src={Picture4} alt="Improves productivity" className="w-full h-auto"/>
                </figure>
                <div className="card-body w-full sm:w-1/2">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-5">
                        Improves productivity
                    </h1>
                    <p className="card-title text-lg sm:text-xl font-bold">
                        At Dunder Mifflin Infinity, our paper doesn’t just hold your words—it holds the key to productivity!
                        ✨ With each sheet designed for maximum efficiency, you’ll find yourself working
                        faster, smarter, and with fewer coffee breaks (sorry, caffeine addicts!).
                        Need to finish that report? Our paper practically writes it for you.
                        Forget your to-do list—it’s already done. With Dunder paper,
                        your productivity soars because we believe in paper that works harder than you do.
                        💼📄 #PaperPower #GetItDone
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

export default Productivity;