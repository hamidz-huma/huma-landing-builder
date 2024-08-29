import { useEffect } from "react";

export const SliderType2 = ({ children, ...props }) => {
  return (
    <>
      <section className="hc-waitlist-page-section centered section-with-no-margin overflow-hidden tpl-slider-section">
        <div className="section-content-wrapper vertical">
          <div className="section-header">
            <h2 className="center h0">Start with app templates</h2>
            <p className="text-body-2 centered">
              Kickstart your project with our comprehensive app templates,
              crafted in collaboration with clinical experts from leading health
              systems and life sciences companies worldwide. <br />
              Each template is meticulously designed to enhance care management,
              providing tailored features and content to address specific health
              conditions.
            </p>
          </div>
          
          <div className="div-block-4 splide-tpl">
            <ul role="list" className="list slide-labels-list tpl-slide-labels">
              <li className="second-button slide-label slide-label__active">
                <div>Asthma</div>
              </li>
              <li className="second-button slide-label">
                <div>COPD</div>
              </li>
              <li className="second-button slide-label">
                <div>Hypertension</div>
              </li>
              <li className="second-button slide-label">
                <div>Oncology</div>
              </li>
              <li className="second-button slide-label">
                <div>Myasthenia Gravis</div>
              </li>
              <li className="second-button slide-label">
                <div>Diabetes</div>
              </li>
              <li className="second-button slide-label">
                <div>Knee surgery</div>
              </li>
            </ul>
            <div className="splide__track tpl-slide-track">
              <ul role="list" className="splide__list">
                <li className="splide__slide">
                  <div className="tab-content-wrapper splide-tpl-content-wrapper">
                    <div className="tplslde-container asthma">
                      <div className="tplslde-content-wrapper">
                        <div className="tplslde-header">
                          <h3 className="heading-5 tplslde-heading">
                            Asthma solution
                          </h3>
                          <div className="tplslde-badges">
                            <div className="tplslde-badge">
                              <img
                                src="images/Checkmark.svg"
                                loading="lazy"
                                alt=""
                              />
                              <div className="tplslde-badge-text">
                                FDA approved
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="tplslde-content">
                          <p className="paragraph">
                            The Asthma solution template is designed to empower
                            individuals with asthma to take control of their
                            condition through comprehensive disease-management
                            tools and content.
                          </p>
                          <ul role="list" className="tplslde-list">
                            <li className="tplslde-list-item">
                              <img
                                src="images/Tick.svg"
                                loading="lazy"
                                alt=""
                              />
                              <div className="text-block-3">
                                Track symptoms and medication use
                              </div>
                            </li>
                            <li className="tplslde-list-item">
                              <img
                                src="images/Tick.svg"
                                loading="lazy"
                                alt=""
                              />
                              <div className="text-block-3">
                                Receive personalized insights and alerts
                              </div>
                            </li>
                            <li className="tplslde-list-item">
                              <img
                                src="images/Tick.svg"
                                loading="lazy"
                                alt=""
                              />
                              <div className="text-block-3">
                                Take proactive steps to control asthma
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="tplslde-pic">
                        <img
                          src="images/asthma-template_1.avif"
                          loading="lazy"
                          alt=""
                          className="tplside-img-elm tplside-img-elm-cover"
                        />
                      </div>
                    </div>
                  </div>
                </li>
                <li className="splide__slide">
                  <div className="tab-content-wrapper splide-tpl-content-wrapper">
                    <div className="tplslde-container copd">
                      <div className="tplslde-content-wrapper">
                        <div className="tplslde-header">
                          <h3 className="heading-5 tplslde-heading">
                            COPD solution
                          </h3>
                          <div className="tplslde-badges">
                            <div className="tplslde-badge">
                              <img
                                src="images/Checkmark.svg"
                                loading="lazy"
                                alt=""
                              />
                              <div className="tplslde-badge-text">
                                FDA approved
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="tplslde-content">
                          <p className="paragraph">
                            The COPD solution template is crafted to enable
                            individuals with COPD to manage their condition
                            effectively by providing them with thorough
                            disease-management tools and resources.
                          </p>
                          <ul role="list" className="tplslde-list">
                            <li className="tplslde-list-item">
                              <img
                                src="images/Tick.svg"
                                loading="lazy"
                                alt=""
                              />
                              <div className="text-block-3">
                                Daily symptom log with severity ratings
                              </div>
                            </li>
                            <li className="tplslde-list-item">
                              <img
                                src="images/Tick.svg"
                                loading="lazy"
                                alt=""
                              />
                              <div className="text-block-3">
                                Peak flow and oxygen level fields
                              </div>
                            </li>
                            <li className="tplslde-list-item">
                              <img
                                src="images/Tick.svg"
                                loading="lazy"
                                alt=""
                              />
                              <div className="text-block-3">
                                Medication usage records
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="tplslde-pic">
                        <img
                          src="images/copd-template_1.avif"
                          loading="lazy"
                          alt=""
                          className="tplside-img-elm tplside-img-elm-cover"
                        />
                      </div>
                    </div>
                  </div>
                </li>
                <li className="splide__slide">
                  <div className="tab-content-wrapper splide-tpl-content-wrapper">
                    <div className="tplslde-container hypertension">
                      <div className="tplslde-content-wrapper">
                        <div className="tplslde-header">
                          <h3 className="heading-5 tplslde-heading">
                            Hypertension solution
                          </h3>
                          <div className="tplslde-badges">
                            <div className="tplslde-badge">
                              <img
                                src="images/Checkmark.svg"
                                loading="lazy"
                                alt=""
                              />
                              <div className="tplslde-badge-text">
                                FDA approved
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="tplslde-content">
                          <p className="paragraph">
                            The Hypertension solution template is created to
                            assist individuals with high blood pressure in
                            effectively controlling their condition. It offers a
                            range of resources and tools for comprehensive
                            disease management.
                          </p>
                          <ul role="list" className="tplslde-list">
                            <li className="tplslde-list-item">
                              <img
                                src="images/Tick.svg"
                                loading="lazy"
                                alt=""
                              />
                              <div className="text-block-3">
                                Fields for pulse rate and symptoms
                              </div>
                            </li>
                            <li className="tplslde-list-item">
                              <img
                                src="images/Tick.svg"
                                loading="lazy"
                                alt=""
                              />
                              <div className="text-block-3">
                                Medication intake records
                              </div>
                            </li>
                            <li className="tplslde-list-item">
                              <img
                                src="images/Tick.svg"
                                loading="lazy"
                                alt=""
                              />
                              <div className="text-block-3">
                                Lifestyle factors: diet, activity, stress, sleep
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="tplslde-pic">
                        <img
                          src="images/hyperthension-template_1.avif"
                          loading="lazy"
                          alt=""
                          className="tplside-img-elm tplside-img-elm-contain"
                        />
                      </div>
                    </div>
                  </div>
                </li>
                <li className="splide__slide">
                  <div className="tab-content-wrapper splide-tpl-content-wrapper">
                    <div className="tplslde-container oncology">
                      <div className="tplslde-content-wrapper">
                        <div className="tplslde-header">
                          <h3 className="heading-5 tplslde-heading">
                            Oncology solution
                          </h3>
                          <div className="tplslde-badges">
                            <div className="tplslde-badge">
                              <img
                                src="images/Checkmark.svg"
                                loading="lazy"
                                alt=""
                              />
                              <div className="tplslde-badge-text">
                                FDA approved
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="tplslde-content">
                          <p className="paragraph">
                            The Oncology solution template is designed to
                            support individuals living with cancer by offering a
                            wide array of resources and tools for comprehensive
                            management of their condition.
                          </p>
                          <ul role="list" className="tplslde-list">
                            <li className="tplslde-list-item">
                              <img
                                src="images/Tick.svg"
                                loading="lazy"
                                alt=""
                              />
                              <div className="text-block-3">
                                Daily log for temperature, weight, and pain
                              </div>
                            </li>
                            <li className="tplslde-list-item">
                              <img
                                src="images/Tick.svg"
                                loading="lazy"
                                alt=""
                              />
                              <div className="text-block-3">
                                Fields for symptoms
                              </div>
                            </li>
                            <li className="tplslde-list-item">
                              <img
                                src="images/Tick.svg"
                                loading="lazy"
                                alt=""
                              />
                              <div className="text-block-3">
                                Medication tracking
                              </div>
                            </li>
                            <li className="tplslde-list-item">
                              <img
                                src="images/Tick.svg"
                                loading="lazy"
                                alt=""
                              />
                              <div className="text-block-3">
                                Sections for diet, hydration, and activity
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="tplslde-pic">
                        <img
                          src="images/oncology-template_1.avif"
                          loading="lazy"
                          alt=""
                          className="tplside-img-elm tplside-img-elm-cover"
                        />
                      </div>
                    </div>
                  </div>
                </li>
                <li className="splide__slide">
                  <div className="tab-content-wrapper splide-tpl-content-wrapper">
                    <div className="tplslde-container mg">
                      <div className="tplslde-content-wrapper">
                        <div className="tplslde-header">
                          <h3 className="heading-5 tplslde-heading">
                            Myasthenia Gravis
                          </h3>
                          <div className="tplslde-badges">
                            <div className="tplslde-badge">
                              <img
                                src="images/Checkmark.svg"
                                loading="lazy"
                                alt=""
                              />
                              <div className="tplslde-badge-text">
                                FDA approved
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="tplslde-content">
                          <p className="paragraph">
                            The Myasthenia Gravis care template is tailored to
                            assist individuals with this rare neuromuscular
                            disease by providing specialized resources and tools
                            for thorough management of their condition.
                          </p>
                          <ul role="list" className="tplslde-list">
                            <li className="tplslde-list-item">
                              <img
                                src="images/Tick.svg"
                                loading="lazy"
                                alt=""
                              />
                              <div className="text-block-3">
                                Daily log for muscle strength, fatigue, vision
                              </div>
                            </li>
                            <li className="tplslde-list-item">
                              <img
                                src="images/Tick.svg"
                                loading="lazy"
                                alt=""
                              />
                              <div className="text-block-3">
                                Fields for other symptoms
                              </div>
                            </li>
                            <li className="tplslde-list-item">
                              <img
                                src="images/Tick.svg"
                                loading="lazy"
                                alt=""
                              />
                              <div className="text-block-3">
                                Medication doses and times
                              </div>
                            </li>
                            <li className="tplslde-list-item">
                              <img
                                src="images/Tick.svg"
                                loading="lazy"
                                alt=""
                              />
                              <div className="text-block-3">
                                Sections for diet, activity, and rest
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="tplslde-pic">
                        <img
                          src="images/mg-templates_1.avif"
                          loading="lazy"
                          alt=""
                          className="tplside-img-elm tplside-img-elm-cover"
                        />
                      </div>
                    </div>
                  </div>
                </li>
                <li className="splide__slide">
                  <div className="tab-content-wrapper splide-tpl-content-wrapper">
                    <div className="tplslde-container diabetes">
                      <div className="tplslde-content-wrapper">
                        <div className="tplslde-header">
                          <h3 className="heading-5 tplslde-heading">
                            Diabetes solution
                          </h3>
                          <div className="tplslde-badges">
                            <div className="tplslde-badge">
                              <img
                                src="images/Checkmark.svg"
                                loading="lazy"
                                alt=""
                              />
                              <div className="tplslde-badge-text">
                                FDA approved
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="tplslde-content">
                          <p className="paragraph">
                            The diabetes management template provides essential
                            tools and resources to help individuals effectively
                            manage their condition.
                          </p>
                          <ul role="list" className="tplslde-list">
                            <li className="tplslde-list-item">
                              <img
                                src="images/Tick.svg"
                                loading="lazy"
                                alt=""
                              />
                              <div className="text-block-3">
                                Daily blood glucose levels
                              </div>
                            </li>
                            <li className="tplslde-list-item">
                              <img
                                src="images/Tick.svg"
                                loading="lazy"
                                alt=""
                              />
                              <div className="text-block-3">Insulin doses</div>
                            </li>
                            <li className="tplslde-list-item">
                              <img
                                src="images/Tick.svg"
                                loading="lazy"
                                alt=""
                              />
                              <div className="text-block-3">
                                Carbohydrate intake
                              </div>
                            </li>
                            <li className="tplslde-list-item">
                              <img
                                src="images/Tick.svg"
                                loading="lazy"
                                alt=""
                              />
                              <div className="text-block-3">
                                Physical activity
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="tplslde-pic">
                        <img
                          src="images/diabetes-template_1.avif"
                          loading="lazy"
                          alt=""
                          className="tplside-img-elm tplside-img-elm-cover"
                        />
                      </div>
                    </div>
                  </div>
                </li>
                <li className="splide__slide">
                  <div className="tab-content-wrapper splide-tpl-content-wrapper">
                    <div className="tplslde-container surgery">
                      <div className="tplslde-content-wrapper">
                        <div className="tplslde-header">
                          <h3 className="heading-5 tplslde-heading">
                            Knee surgery solution
                          </h3>
                          <div className="tplslde-badges">
                            <div className="tplslde-badge">
                              <img
                                src="images/Checkmark.svg"
                                loading="lazy"
                                alt=""
                              />
                              <div className="tplslde-badge-text">
                                FDA approved
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="tplslde-content">
                          <p className="paragraph">
                            The knee surgery template is designed to support
                            individuals undergoing surgery by offering a
                            comprehensive set of resources and tools to aid in
                            their rehabilitation process.
                          </p>
                          <ul role="list" className="tplslde-list">
                            <li className="tplslde-list-item">
                              <img
                                src="images/Tick.svg"
                                loading="lazy"
                                alt=""
                              />
                              <div className="text-block-3">
                                Daily pain levels and mobility
                              </div>
                            </li>
                            <li className="tplslde-list-item">
                              <img
                                src="images/Tick.svg"
                                loading="lazy"
                                alt=""
                              />
                              <div className="text-block-3">
                                Swelling and discomfort
                              </div>
                            </li>
                            <li className="tplslde-list-item">
                              <img
                                src="images/Tick.svg"
                                loading="lazy"
                                alt=""
                              />
                              <div className="text-block-3">
                                Exercise routines
                              </div>
                            </li>
                            <li className="tplslde-list-item">
                              <img
                                src="images/Tick.svg"
                                loading="lazy"
                                alt=""
                              />
                              <div className="text-block-3">
                                Physical therapy sessions
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="tplslde-pic">
                        <img
                          src="images/knee-template_1.avif"
                          loading="lazy"
                          alt=""
                          className="tplside-img-elm tplside-img-elm-cover"
                        />
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
