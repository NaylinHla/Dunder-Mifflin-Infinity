import Picture3 from "../../../assets/Carousel_Assets/CarouselPicture3.png";
import {Link} from "react-router-dom";

function Space() {
    return (
        <div className="p-4">
            <div className="card card-side bg-base-100 shadow-xl flex flex-col sm:flex-row">
                <figure className="w-full sm:w-1/2">
                    <img src={Picture3} alt="All profits go to space" className="w-full h-auto"/>
                </figure>
                <div className="card-body w-full sm:w-1/2">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-5">
                        All profits go to space
                    </h1>
                    <p className="card-title text-lg sm:text-xl font-bold">
                        At Dunder Mifflin Infinity, we're not just paper pushers—we're future space explorers!
                        🚀 Every ream you buy brings us one step closer to the stars. Sure,
                        we could focus on "business growth" or "market shares,"
                        but why settle for that when we can dream of intergalactic offices?
                        All our profits go toward our ultimate mission: selling paper on the moon! Because even in space,
                        someone’s going to need to print those TPS reports. 🌌 #PaperToTheMoon #LiftOffWithDunder
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

export default Space;