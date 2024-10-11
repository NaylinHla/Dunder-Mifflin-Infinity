import React, { useEffect, useRef } from "react";
import {Link} from "react-router-dom";

interface CarouselProps {
    text: string;
    imageSrc: string;
    Picture: string;
}

const Carousel: React.FC<CarouselProps> = ({ text, imageSrc, Picture }) => {
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const cards = document.querySelectorAll<HTMLDivElement>('.carousel-card');

        // Get the maximum height from the text areas
        const maxHeight = Array.from(cards).reduce((max, card) => {
            const cardText = card.querySelector<HTMLDivElement>('.text-area');
            return Math.max(max, cardText ? cardText.scrollHeight : 0);
        }, 0);

        // Set all text areas to the maximum height
        cards.forEach(card => {
            const cardText = card.querySelector<HTMLDivElement>('.text-area');
            if (cardText) {
                cardText.style.height = `${maxHeight}px`;
            }
        });
    }, [text]);

    return (
        <div className="carousel-card flex flex-col items-center mb-5">
            <div className="card w-full max-w-xs md:max-w-md lg:max-w-lg shadow-lg rounded-lg overflow-hidden hover:bg-gray-200">
                <div className="relative w-full aspect-video">
                    <Link to={Picture}>
                        <img
                            src={imageSrc}
                            className="absolute top-0 left-0 w-full h-full object-cover"
                            alt="Carousel item"
                        />
                    </Link>
                </div>
                <div ref={textRef} className="text-area p-4 flex-grow flex items-center justify-center text-center">
                    <h3 className="text-lg md:text-xl lg:text-2xl font-semibold">{text}</h3> {/* Responsive text size */}
                </div>
            </div>
        </div>
    );
};

export default Carousel;
