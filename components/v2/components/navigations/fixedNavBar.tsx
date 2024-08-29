export const DefaultNavigationBar = ({ ...props }) => {
  return (
    <div
      data-animation="default"
      data-collapse="none"
      data-duration="400"
      data-easing="ease"
      data-easing2="ease"
      role="banner"
      className="navbar w-nav"
    >
      <a href="#hero" className="nav-logo-wrapper w-nav-brand">
        <img
          width="34"
          height="34"
          alt=""
          src="images/huma-logo.svg"
          loading="lazy"
          className="nav-logo"
        />
        <div className="logo-tlabel">Huma Workspace</div>
        <div className="logo-beta-label">Beta</div>
      </a>
      <div className="nav-container">
        <div className="nav-menu">
          <a
            href="https://workspace.huma.com/"
            target="_blank"
            className="hero-button-dark-grey nav-button-small secondarybtn w-button"
          >
            Login
          </a>
          <a
            href="https://www.huma.com/huma-cloud-platform-join-waitlist"
            target="_blank"
            className="hero-button-dark-grey nav-button-small w-button"
          >
            Join the waitlist
          </a>
        </div>
      </div>
      <div className="menu-btn-wrapper">
        <div className="buger-line is--top"></div>
        <div className="buger-line is--bottom"></div>
      </div>
      <div className="announcement-old">
        <div className="announcement-container-old">
          <div className="announce-text-wrap-old">
            <div className="announcement-text-old">
              Huma to provide best-in-className digital clinical trials
              solutions through landmark acquisition of Alcedis
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
