import React from "react";

export const Hero = () => {
  return (
    <>
      <div id="hero" className="div-block-6">
        <section className="hc-waitlist-page-hero-section hero-new-vahid">
          <div className="w-layout-blockcontainer hc-waitlist-page-hero-container w-container">
            <div className="hero-content-wrapper">
              <h1 className="h1-hc-waitlist-page centre-alighn">
                Launch digital health solutions <br />
                in days, not years.
              </h1>
              <div className="div-block-10">
                <div className="text-block-4">Coming in beta this fall.</div>
                <a
                  href="https://cdn.prod.website-files.com/630f8e2cb1a0c23e614b6a24/6317276584a76574faa36c39_HumaPrivacyPolicy.pdf"
                  target="_blank"
                  className="link"
                >
                  Learn more
                </a>
              </div>
              <div className="hc-waitlist-hero-img-wrapper">
                <img
                  sizes="85vw"
                  srcSet="images/mockups_1mockups.avif 500w, images/mockups_1mockups.avif 800w, images/mockups_1mockups.avif 1080w, images/mockups_1.avif 2609w"
                  alt=""
                  src="images/mockups_1.avif"
                  loading="eager"
                  className="hc-waitlist-page-hero-img"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
