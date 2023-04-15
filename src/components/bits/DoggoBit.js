import React, { useState, useEffect } from "react";

import shape1 from "../../images/shape1.svg";
import shape2 from "../../images/shape2.svg";
import shape3 from "../../images/shape3.svg";
import shape4 from "../../images/shape4.svg";
import shape5 from "../../images/shape5.svg";
import shape6 from "../../images/shape6.svg";
import shape7 from "../../images/shape7.svg";
import shape8 from "../../images/shape8.svg";
import shape9 from "../../images/shape9.svg";

import dog1 from "../../images/dog1.png";
import dog2 from "../../images/dog2.png";
import dog3 from "../../images/dog3.png";
import dog4 from "../../images/dog4.png";
import dog5 from "../../images/dog5.png";
import dog6 from "../../images/dog6.png";

const shapes = [
    shape1,
    shape2,
    shape3,
    shape4,
    shape5,
    shape6,
    shape7,
    shape8,
    shape9,
];

const images = [
    dog1,
    dog2,
    dog3,
    dog4,
    dog5,
    dog6,
];

const DoggoBit = ({isHomepage = false}) => {
  const [randomShape, setRandomShape] = useState(null);
  const [randomImage, setRandomImage] = useState(null);
  const [randomAngle, setRandomAngle] = useState(0);

  useEffect(() => {
    setRandomShape(shapes[Math.floor(Math.random() * shapes.length)]);
    setRandomImage(images[Math.floor(Math.random() * images.length)]);
    setRandomAngle(Math.floor(Math.random * 360));
  }, []);

  return (
    <div className={`d-flex align-items-center doggo-wrap ${isHomepage ? 'doggo-home sticky-bottom' : ''}`}>
          {randomImage && (
            <div className="position-relative d-inline-block doggo-div">
            {randomShape && (
                <img src={randomShape} alt="Random" className="img-fluid doggo-shape" />
              )}
              <img src={randomImage} alt="Random" className="img-fluid doggo-img" style={{transform: `rotate(${randomAngle}deg)`}}/>
            </div>
          )}
    </div>
  );
};

export default DoggoBit;
