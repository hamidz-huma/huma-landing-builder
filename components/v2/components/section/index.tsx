import { DefaultSection } from "./defaultSection";
import {GridPhotoSection} from "./gridPhotoSection";
import { SectionType1 } from "./sectionType1";
import { SectionType2 } from "./sectionType2";
import { SectionType3 } from "./sectionType3";
import { SectionType4 } from "./sectionType4";

export const SectionComponent = ({ children, ...props }) => {
  switch (props.type) {
    case "type-1":
      return <SectionType1 {...props}>{children}</SectionType1>;
    case "type-2":
      return <SectionType2 {...props}>{children}</SectionType2>;
      case "type-3":
      return <SectionType3 {...props}>{children}</SectionType3>;
    case "type-4":
      return <SectionType4 {...props}>{children}</SectionType4>;
    case "type-5":
      return <GridPhotoSection {...props}>{children}</GridPhotoSection>;
    default:
      return <DefaultSection {...props}>{children}</DefaultSection>;
  }
};
