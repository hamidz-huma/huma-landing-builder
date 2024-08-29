import { SliderType1 } from "./sliderType1";
import { SliderType2 } from "./sliderType2";
import { SliderType3 } from "./sliderType3";

export const Slider = ({ children, ...props }) => {
  switch (props.type) {
    case "type-1":
      return <SliderType1 {...props}>{children}</SliderType1>;
    case "type-2":
      return <SliderType2 {...props}>{children}</SliderType2>;
      case "type-3":
      return <SliderType3 {...props}>{children}</SliderType3>;
    default:
      return <SliderType2 {...props}>{children}</SliderType2>;
  }
};
