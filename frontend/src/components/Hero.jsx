import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
    slidesToSlide: 1,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1,
    slidesToSlide: 1,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1,
  },
};

function Hero() {
  return (
    <Carousel
      responsive={responsive}
      infinite={true}
      autoPlay={true}
      autoPlaySpeed={2000}
      arrows={true}
      swipeable={true}
      draggable={true}
      keyBoardControl={true}
      pauseOnHover={false}
      shouldResetAutoplay={false}
      transitionDuration={600}
    >
      <div className="relative  md:h-[80vh]">
        <img src="/1.jpg" alt="slide1" className="w-full h-full object-cover" />
      </div>

      <div className="relative md:h-[80vh]">
        <img src="/2.jpg" alt="slide2" className="w-full h-full object-cover" />
      </div>

      <div className="relative  md:h-[80vh]">
        <img src="/11.jpg" alt="slide3" className="w-full h-full object-cover" />
      </div>
    </Carousel>
  );
}

export default Hero;
