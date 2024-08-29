import { HeroType1 } from "./HeroType1";
import { HeroType2 } from "./HeroType2";

export const Hero = ({ children, ...props }) => {
  switch (props.type) {
    case "type-1":
      return <HeroType1 {...props}>{children}</HeroType1>;
      case "type-2":
        return <HeroType2 {...props}>{children}</HeroType2>;
  }
};
