import React from 'react';
import './index.css';

export const SectionType3 = ({ children, ...props }) =>  {
  return (
    <>
    <section className="features-section dark">
  <div className="w-layout-blockcontainer features-container dark w-container">
    <div className="feature-content-wrapper dark">
      <div className="section-header large dark">
        <h2 className="center white">Go beyond No-Code: Customise with Huma SDKs</h2>
        <p className="text-body-2 centered dark">When no-code isn’t enough, unlock advanced customisation with Huma SDKs. Seamlessly integrate Huma’s powerful features—including UI elements and widgets—into your own apps. Enhance functionality, ensure compliance, and deliver superior user experiences effortlessly with our robust SDK and API options.</p>
      </div>
      <div id="w-node-_84d9414b-ead8-37b0-10f7-f65f765b3736-0fbb7d6b" className="feature-img-wrapper dark">
        <div className="featured-content-img-wrapper">
          <img src="images/blobs.avif" loading="lazy" sizes="(max-width: 1439px) 100vw, 1200px" srcSet="images/blobs-p-500.png 500w, images/blobs-p-800.png 800w, images/blobs-p-1080.png 1080w, images/blobs-p-1600.png 1600w, images/blobs-p-2000.png 2000w, images/blobs.avif 2392w" alt="" className="image featured-content-img"/>
          </div>
          <img src="images/sdk-product-shot_1.avif" loading="lazy" alt="" className="feature-img"/>
      </div>
    </div>
  </div>
  <div className="cta">
    <div className="cta-bg-img"><img src="images/CTA_1.avif" loading="lazy" sizes="(max-width: 479px) 95vw, (max-width: 767px) 94vw, (max-width: 991px) 90vw, (max-width: 1439px) 93vw, 94vw" srcSet="images/CTA_1CTA.avif 500w, images/CTA_1CTA.avif 800w, images/CTA_1CTA.avif 1080w, images/CTA_1.avif 2688w" alt="" className="image cta-bg-img-c"/></div>
    <div className="section-header large dark cta-block">
      <h2 className="center cta-block white">Fast-track your health innovations.</h2>
      <p className="text-body-2 centered dark cta-blcok">Contact us to learn more about Huma Workspace and how our capabilities can help your organisation.  </p>
      <div className="fast-track-cta-container">
        <a href="https://www.huma.com/huma-cloud-platform-join-waitlist#" target="_blank" className="button-primary w-button">Join the waitlist</a>
        <a href="https://workspace.huma.com/" target="_blank" className="button-primary secondary-ghost w-button">Login</a>
      </div>
    </div>
  </div>
</section>
{children}

    </>
  );
}
