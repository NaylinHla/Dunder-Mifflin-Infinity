import Picture1 from "../../../assets/Carousel_Assets/CarouselPicture1.png";
import {Link} from "react-router-dom";

function Rainbow() {
    return (
        <div className="p-4">
            <div className="card card-side bg-base-100 shadow-xl flex flex-col sm:flex-row">
                <figure className="w-full sm:w-1/2">
                    <img src={Picture1} alt="Any color of the rainbow" className="w-full h-auto"/>
                </figure>
                <div className="card-body w-full sm:w-1/2">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-5">
                        Any color of the rainbow
                    </h1>
                    <p className="card-title text-lg sm:text-xl font-bold">
                        At Dunder Mifflin Infinity, we know that every paper has its place, whether it's white, blue, pink,
                        or even that weird neon green. Just like our paper, people come in all colors, too!
                        We're proud to say we support the LGBTQ+ community because, like paper,
                        love comes in all shades—and we believe everyone deserves to write their own story.
                        Plus, nothing screams "inclusive workplace" like being able to color-code your memos!
                        🌈 #LoveIsPaper #PaperWithPride
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

export default Rainbow;