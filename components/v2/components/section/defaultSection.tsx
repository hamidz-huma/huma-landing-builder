import React from "react";
import "./index.css";

export const DefaultSection = ({ children, ...props }) => {
  return (
    <div className="main-container">
      <div className="flex-column-fa">
        <div className="final" />
        <div className="button">
          <div className="pause">
            <div className="stroke" />
            <div className="stroke-1" />
          </div>
          <span className="button-text">Pause</span>
        </div>
      </div>
      <div className="flex-column-b">
        <span className="ready-to-start">Ready to start?</span>
        <span className="large-text">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris
        </span>
        <div className="buttons">
          <button className="button-2">
            <span className="button-text-3">Build your app</span>
          </button>
          <button className="button-4">
            <span className="contact-us">Contact us</span>
          </button>
        </div>
      </div>
    </div>
  );
};
