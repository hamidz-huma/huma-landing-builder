export const HeroType1 = ({ children, ...props }) => {
  return (
    <div id="hero" className={`div-block-6 ${props.classNames? props.classNames.join(' ') : ''}`} >
      <section className="hc-waitlist-page-hero-section hero-new-vahid">
        <div className="w-layout-blockcontainer hc-waitlist-page-hero-container w-container">
          <div className="hero-content-wrapper">
            {props.data.heading.text && (
              <h1
                className="h1-hc-waitlist-page centre-alighn"
                dangerouslySetInnerHTML={{ __html: props.data.heading.text }}
              ></h1>
            )}
            <div className="div-block-10">
              {props.data.heading.subText1 && (
                <div
                  className="text-block-4"
                  dangerouslySetInnerHTML={{
                    __html: props.data.heading.subText1,
                  }}
                ></div>
              )}
              {props.data.heading.cta.text && (
                <a
                  href={props.data.heading.cta.text}
                  target="_blank"
                  className="link"
                  dangerouslySetInnerHTML={{
                    __html: props.data.heading.cta.text,
                  }}
                ></a>
              )}
            </div>
            <div className="hc-waitlist-hero-img-wrapper">
              <img
                sizes="85vw"
                srcSet={props.data.image.src}
                alt=""
                src="images/mockups_1.avif"
                loading="eager"
                className="hc-waitlist-page-hero-img"
              />
            </div>
          </div>
        </div>
      </section>
      {children}
    </div>
  );
};
