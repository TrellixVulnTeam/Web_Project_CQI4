import React from "react";
import classnames from "classnames";
import pokeball from "./images/pokeball.png";
import "./card.scss";
import image from '../TestGame/Images/download.jpg'

const Card = ({ onClick, card, index, isInactive, isFlipped, isDisabled }) => {
  const handleClick = () => {
    !isFlipped && !isDisabled && onClick(index);
  };

  return (
    <div
      className={classnames("border-0 card row align-items-center justify-content-center", {
        "is-flipped": isFlipped,
        "is-inactive": isInactive
      })}
      onClick={handleClick}
    >
      <div className="card-face card-font-face row align-items-center justify-content-center">
        {/*Disable pointer when the card is inactive*/}
        <img src={image} alt="front" style={{ cursor: isInactive ? "default" : "pointer" }} />

      </div>
      <div className="card-face card-back-face">
        <img src={card.image} alt="back" />
      </div>
    </div>
  );
};

export default Card;
