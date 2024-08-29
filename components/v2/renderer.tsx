"use client";
import React from "react";
import { Hero } from "./components/hero";
import parse, { Element } from "html-react-parser";
import { Slider } from "./components/slider";
import { SectionComponent } from "./components/section";
import { Slide } from "./components/slider/slide";

export const HtmlValue = ({ value }) => {
  return parse(value);
};

export const HtmlRenderer = ({ tag, children, value, ...props }) => {
  const Tag = tag || "div"; // Default to 'div' if no tag specified
  return <Tag {...props}>{children}</Tag>;
};

export const Renderer = ({ type, props, value, children= [] }:{type:any, props:any,value: any,children: Array<any> }) => {
  // Choose which component to render based on type
  switch (type) {
    case "slide":
      return (
        <Slide {...props}>
          {children.map((child, index) => (
            <Renderer key={index} {...child} />
          ))}
        </Slide>
      );
    case "slider":
      return (
        <Slider {...props}>
          {children.map((child, index) => (
            <Renderer key={index} {...child} />
          ))}
        </Slider>
      );
    case "section":
      return (
        <SectionComponent {...props}>
          {children.map((child, index) => (
            <Renderer key={index} {...child} />
          ))}
        </SectionComponent>
      );
    case "hero":
      return (
        <Hero {...props}>
          {children.map((child, index) => (
            <Renderer key={index} {...child} />
          ))}
        </Hero>
      );
    case "html":
      return (
        <HtmlRenderer {...props} value={value}>
          <HtmlValue value={value}></HtmlValue>
          {children.map((child, index) => (
            <Renderer key={index} {...child} value={value} />
          ))}
        </HtmlRenderer>
      );
    default:
      return null; // Render nothing if the type is not recognized
  }
};
