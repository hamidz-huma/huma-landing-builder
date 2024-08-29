export const SimpleSlide  = ({ children, ...props })=>{
    return <li className="splide__slide vital-slidesmall">
    <div className="tab-content-wrapper">
      <div className="slide-content-wrapper small">
        <div className="slide-img-wrapper small">
          <img
            src={props.image.src? props.image.src: ''}
            loading="lazy"
            alt=""
            className="slide-img small"
          />
        </div>
        <div className="card-copy-content">
          <h3 className="heading-3">{props.header}</h3>
          <p className="text-caption">
          {props.description}
          </p>
        </div>
      </div>
    </div>
  </li>
}