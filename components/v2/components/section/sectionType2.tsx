import React from 'react';
import './index.css';

export const SectionType2 = ({ children, ...props }) =>  {
  return (
    <section className="hc-waitlist-page-section gradient">
    <div className="section-content-wrapper horizontal">
      <div className="lottie-animation lottie-ready-to-start" data-w-id="776deb3b-dbf5-2d3a-3695-734ddf3cb957" data-animation-type="lottie" data-src="documents/data-2.json" data-loop="1" data-direction="1" data-autoplay="1" data-is-ix2-target="0" data-renderer="svg" data-default-duration="10.75" data-duration="0"></div>
      <div className="section-copy-content-wrapper">
        <h2 className="left">Ready to start?<br/></h2>
        <p className="text-body-2">Huma Workspace is designed to seamlessly integrate all essential health vitals and provide a robust infrastructure for creating apps across all disease areas.<br/></p>
        <div className="div-block-15">
          <a href="https://www.huma.com/huma-cloud-platform-join-waitlist" target="_blank" className="hero-button-dark-grey w-button">Join the waitlist</a>
          <a href="https://workspace.huma.com/" target="_blank" className="hero-button-dark-grey secondary-button w-button">Login</a>
        </div>
      </div>
    </div>
  </section>
  );
}
