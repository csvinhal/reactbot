import React from "react";
import "./Card.css";

const Card = (props) => {
  return (
    <div className="card__container">
      <div className="card">
        <div className="card-image">
          <img alt={props.payload.header} src={props.payload.image} />
          <span className="card-title">{props.payload.header}</span>
        </div>
        <div className="card-content">
          {props.payload.description}
          <p>
            <a href="/">{props.payload.price}</a>
          </p>
        </div>
        <div className="card-action">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={props.payload.link}
          >
            GET NOW
          </a>
        </div>
      </div>
    </div>
  );
};

export default Card;
