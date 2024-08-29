import { SimpleSlide } from "./slideSimple";

export const Slide = ({ children, ...props }) => {
  
      return <SimpleSlide {...props}>{children}</SimpleSlide>;
};
