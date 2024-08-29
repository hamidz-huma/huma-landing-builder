import React from 'react';
import './index.css';

export const SectionType1 = ({ children, ...props }) =>  {
  return (
    <section className="hc-waitlist-page-section centered appexp-section">
    <div className="section-content-wrapper vertical">
      <div className="div-block-14">
        <div className="section-header">
          <h2 className="center section-app-exp-titleh2">Build medical apps <br/>with Huma Workspace</h2>
          <p className="text-body-2 centered">Huma Workspace lets you create medical apps with a simple drag and drop of widgets, configured to meet your end-user needs.<br/></p>
        </div>
      </div>
      <div className="div-block-4 splide-app-exp">
        <ul role="list" className="list app-exp-list">
          <li className="default-tab slide-label-app slide-label-app__active">
            <h2 className="h2 sans-serif app-slide-h2">Choose from a library of widgets</h2>
            <p className="text-body">Personalise the patient experience by configuring the widgets to your patients needs.</p>
          </li>
          <li className="default-tab slide-label-app">
            <h2 className="h2 sans-serif app-slide-h2">Build questionnaires and ePROs for each use case</h2>
            <p className="text-body">Get the most out of your app with customised questionnaires and a library of ePROS. Collect health data that matters with Huma’s questionnaire engine.</p>
          </li>
          <li className="default-tab slide-label-app">
            <h2 className="h2 sans-serif app-slide-h2">Create and publish patient engaging content</h2>
            <p className="text-body">Manage all learning resources in one place using the Content Management System (CMS).</p>
          </li>
          <li className="default-tab slide-label-app">
            <h2 className="h2 sans-serif app-slide-h2">Integrate with health devices and enable plugins</h2>
            <p className="text-body">Add medical devices to your apps, enable 3rd party plugins.</p>
          </li>
          <li className="default-tab slide-label-app">
            <h2 className="h2 sans-serif app-slide-h2">Collect real-time insights</h2>
            <p className="text-body">Monitor the performance of your applications and intervene when necessary.</p>
          </li>
        </ul>
        <div className="splide__track app-exp-track">
          <ul role="list" className="splide__list app-exp-list">
            <li className="splide__slide">
              <div className="tab-content-wrapper app-tab-content-wrapper"><img src="images/feature-1_1.avif" loading="lazy" alt="" className="featureimg app-featureimg"/>
                <div className="app-exp-slide-text">
                  <h2 className="h2 sans-serif app-slide-h2">Choose from a library of widgets</h2>
                  <p className="text-body">Personalise the patient experience by configuring the widgets to your patients needs.</p>
                </div>
              </div>
            </li>
            <li className="splide__slide">
              <div className="tab-content-wrapper app-tab-content-wrapper"><img src="images/Qestionnaire-mockup_1.avif" loading="lazy" alt="" className="featureimg app-featureimg"/>
                <div className="app-exp-slide-text">
                  <h2 className="h2 sans-serif app-slide-h2">Build questionnaires and ePROs for each use case</h2>
                  <p className="text-body">Get the most out of your app with customised questionnaires and a library of ePROS. Collect health data that matters with Huma’s questionnaire engine.</p>
                </div>
              </div>
            </li>
            <li className="splide__slide">
              <div className="tab-content-wrapper app-tab-content-wrapper"><img src="images/feature-2_1.avif" loading="lazy" alt="" className="featureimg app-featureimg"/>
                <div className="app-exp-slide-text">
                  <h2 className="h2 sans-serif app-slide-h2">Create and publish patient engaging content</h2>
                  <p className="text-body">Manage all learning resources in one place using the Content Management System (CMS).</p>
                </div>
              </div>
            </li>
            <li className="splide__slide">
              <div className="tab-content-wrapper app-tab-content-wrapper"><img src="images/section-3-card-28_1.avif" loading="lazy" alt="" className="featureimg app-featureimg"/>
                <div className="app-exp-slide-text">
                  <h2 className="h2 sans-serif app-slide-h2">Integrate with health devices and enable plugins</h2>
                  <p className="text-body">Add medical devices to your apps, enable 3rd party plugins.</p>
                </div>
              </div>
            </li>
            <li className="splide__slide">
              <div className="tab-content-wrapper app-tab-content-wrapper"><img src="images/section-3-card-6-grey-bg_1.avif" loading="lazy" alt="" className="featureimg app-featureimg"/>
                <div className="app-exp-slide-text">
                  <h2 className="h2 sans-serif app-slide-h2">Collect real-time insights</h2>
                  <p className="text-body">Monitor the performance of your applications and intervene when necessary.</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
  );
}
