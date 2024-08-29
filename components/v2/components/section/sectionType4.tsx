import React from "react";
import "./index.css";

export const SectionType4 = ({ children, ...props }) => {
  return (
    <>
      <div className="div-block-13">
        <section className="hc-waitlist-page-section left bellowhero">
          <div className="section-content-wrapper horizontal">
            <div className="hc-img-wrapper">
              <img
                loading="lazy"
                src="images/section-2-mockups_1.avif"
                alt=""
                className="hc-img"
              />
            </div>
            <div className="section-copy-content-wrapper section-content-inside-section-left">
              <h2 className="left heading-section-left">
                Accelerate time to launch with Huma Intelligence (Hi)
                <br />
              </h2>
              <p className="text-body-2">
                Hi uses GenAI to rapidly develop a comprehensive prototype for a
                digital health app based on a short user-entered prompt,
                leveraging Huma&#x27;s pre-built modules, templates, and more.
                <br />
              </p>
            </div>
          </div>
        </section>
      </div>
      {children}
    </>
  );
};
