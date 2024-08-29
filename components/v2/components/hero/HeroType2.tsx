
export const HeroType2 = ({ children, ...props }) => {
  return (
    <div>
      <h1>HERO - {props.type}</h1>
      <div id="hero" className="div-block-6">
        <section className="hc-waitlist-page-hero-section hero-new-vahid">
          TYPE 2
        </section>
      </div>
      {children}
    </div>
  );
};
