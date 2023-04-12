import React, { useState, useEffect } from "react";

const shapes = [
    "./images/shape1.svg",
    "./images/shape2.svg",
    "./images/shape3.svg",
    "./images/shape4.svg",
    "./images/shape5.svg",
    "./images/shape6.svg",
    "./images/shape7.svg",
    "./images/shape8.svg",
    "./images/shape9.svg",
];

const images = [
    "./images/dog1.png",
    "./images/dog2.png",
    "./images/dog3.png",
    "./images/dog4.png",
    "./images/dog5.png",
    "./images/dog6.png"
];

const DoggoBit = ({isHomepage = false}) => {
  const [randomShape, setRandomShape] = useState(null);
  const [randomImage, setRandomImage] = useState(null);

  useEffect(() => {
    setRandomShape(shapes[Math.floor(Math.random() * shapes.length)]);
    setRandomImage(images[Math.floor(Math.random() * images.length)]);
  }, []);

  return (
    <div className={`d-flex align-items-center justify-content-center doggo-wrap ${isHomepage ? 'doggo-home' : ''}`}>
          {randomImage && (
            <div className="position-relative d-inline-block doggo-div">
            {randomShape && (
                <img src={randomShape} alt="Random" className="img-fluid doggo-shape" />
              )}
              <img src={randomImage} alt="Random" className="img-fluid doggo-img" />
            </div>
          )}
    </div>
  );
};

export default DoggoBit;
