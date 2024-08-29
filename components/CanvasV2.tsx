import React, { useState, useCallback, useRef, useEffect } from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from "../constants";
import { SectionComponent, DivComponent, Clocks, Hero } from "./index";
import { renderToStaticMarkup, renderToString } from "react-dom/server";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import Modal from "react-modal";

import {
  setFlatData,
  setMessage,
  setRulesWithReferences,
  setSelectedElement,
  setSelectedElementStyle,
} from "@/lib/store/canvasSlice";
import { v4 as uuidv4 } from "uuid";
import parse, { Element } from "html-react-parser";
import {
  addStylesheetWithComputedStyles,
  generateHtmlString,
  getCSSRuleReferencesBySelector,
  getCSSRuleReferencesByClassNames,
  getSelectorByElementId,
  BUILDER_IDS,
  getAllStyleElementsBySelector,
  getAttributes,
} from "@/lib/utils";
import {
  getElementPosition,
  handleDragLeave,
  handleDragOver,
  handleDragStart,
  handleDrop,
} from "@/lib/drag-drop-utils";
import { updateSections } from "@/lib/squidex";
import { registerComponent } from "../lib/webComponents/paragraph";
import { Renderer } from "./v2/renderer";
import { DefaultNavigationBar } from "./v2/components/navigations/fixedNavBar";
import { DefaultFooter } from "./v2/components/footers/defaultFooter";
import Script from "next/script";
export interface IFrameMessage {
  source: string;
  message: {
    type: string;
    data: any;
  };
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "my-component": any;
    }
  }
}
const customStyles = {
  content: {},
};

interface CanvasComponent {
  id: string;
  type: string;
  component: string;
}
//@ts-ignore
export const IframeComponent = ({ srcDoc, ...props }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const dispatch = useAppDispatch();
  const selectedElement = useAppSelector((state) => state.app.selectedElement);
  const message = useAppSelector((state) => state.app.message);
  const flatData = useAppSelector((state) => state.app.flatData);

  let hoverMenu: HTMLDivElement | null = null;

  useEffect(() => {
    const iframe = document.getElementsByTagName("iframe")[0];
    const iframeDoc = iframe.contentDocument;

    if (!selectedElement || typeof selectedElement !== "string") return;

    const element = parse(selectedElement);

    if (!React.isValidElement(element)) return;

    const attributes = getAttributes(element);

    const attributeValues = attributes
      ? Object.fromEntries(
          Object.entries(attributes).map(([key, value]) => [key, value])
        )
      : {};

    if (iframe && iframeDoc) {
      // Find the element by ID
      const prop = element.props as {[k:string]: string}
      const elementToUpdate = iframeDoc?.querySelector(
        getSelectorByElementId(prop[BUILDER_IDS.DATA_ID])
      );

      const sectionToUpdate = iframeDoc?.querySelectorAll(
        "section[builder-section-id]"
      );
      if (elementToUpdate && iframeDoc) {
        // Replace the entire element with new content
        elementToUpdate.outerHTML = generateHtmlString(
          element,
          attributeValues
        ); // Add your new content
        // Replace the old element with the new one
        // elementToUpdate.replaceWith(newElement);
        const f = { ...flatData };
        f.styles = [...getAllStyleElementsBySelector()];
        f.sections = Array.from(sectionToUpdate).map((m) => {
          return {
            content: m.innerHTML,
            props: {},
            name: m.tagName,
          };
        });
        dispatch(setFlatData(f));
        updateSections(f);
      }
    }

    // const elements = iframeDoc?.querySelectorAll(`[${BUILDER_IDS.DATA_ID}]`);
    // elements?.forEach((element) => {
    //   element.addEventListener("dragstart", handleDragStart);
    //   element.addEventListener("dragover", handleDragOver);
    //   element.addEventListener("dragleave", handleDragLeave);
    //   element.addEventListener("drop", handleDrop);
    // });
  }, [selectedElement]);

  const onRecievedMessage = (event: MessageEvent) => {
    if (event.data.source == "iframe") {
      dispatch(setMessage(event.data));
    }
  };

  const listener = useCallback(onRecievedMessage, [message]);

  useEffect(function () {
    window.addEventListener("message", listener);
    return function () {
      window.removeEventListener("message", listener);
    };
  });

  return (
    <iframe
      ref={iframeRef}
      srcDoc={srcDoc}
      {...props}
      width="100%"
      height="100%"
    />
  );
};

export const CanvasV2 = (props: {
  cssString: any;
  humaCssString: any;
  data: any;
}) => {
  const sections: Array<any> = props.data?.flatData.sections;
  const [srcDoc, setSrcDoc] = useState<string>();

  const sectionsComponent = sections
    ? sections.map((value, index) => {
        const component: CanvasComponent = {
          id: `${index + 1}`,
          type: ItemTypes.SECTION,
          component: value.content,
        };
        return component;
      })
    : [];

  const [components, setComponents] = useState<CanvasComponent[]>([
    ...sectionsComponent,
  ]);

  const scripts = [
    <script
      key={"0"}
      async
      src="https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=6684599c709edcc788d9219e"
      type="text/javascript"
      integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0="
      crossOrigin="anonymous"
    />,

    <script
      key={"1"}
      async
      src="https://cdn.prod.website-files.com/6684599c709edcc788d9219e/js/landing-page-huma-workspace.016285210.js"
      type="text/javascript"
    />,
    <script
      key={"2"}
      async
      src="https://cdn.jsdelivr.net/npm/@splidejs/splide@3.2.2/dist/js/splide.min.js"
    ></script>,

    ...props.data?.flatData?.scripts.map(
      (scriptString: { script: string }, index: number) => {
        return (
          <script
            async
            key={index + 2}
            type="text/javascript"
            dangerouslySetInnerHTML={{
              __html: scriptString.script,
            }}
          ></script>
        );
      }
    ),
  ];
  
  const styles: React.JSX.Element[] = [
    <style
      type="text/css"
      key={"0"}
      dangerouslySetInnerHTML={{
        __html: `
        #builder-hover-menu{
        z-index: 10000;
        background-color: #478dea;
    color: white;
    padding: 5px;
    border-radius: 4px;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.3);
        }
        .builder-add-element{
            color: white;
            font-size: 12px;
            cursor: pointer;
            display: inline-block;
            width: 20px;
            height: 20px;
            line-height: 20px;
            text-align: center;
            background: black;
            }
        .draggable{
            background-color: lightgreen;
            cursor: grab;
            position: absolute;
        }
        .drop-target {
            border: 2px dashed red;
        }

            .drag-hover,.drag-over{
             border-bottom: 2px dashed lightgreen;
            }
        .placeholder {
            background-color: rgba(0, 255, 0, 0.2);
            border: 2px dashed green;
            position: absolute;
        }
    `,
      }}
    />,
    ...props.data?.flatData?.styles.map(
      (styleString: { style: string; props: any }, index: number) => {
        return (
          <style
            key={index + 2}
            type="text/css"
            id={index + 2}
            {...styleString.props}
            dangerouslySetInnerHTML={{
              __html: styleString.style,
            }}
          ></style>
        );
      }
    ),
  ];

  useEffect(() => {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.body.appendChild(iframe);
    const iframeDoc = iframe.contentDocument;

    if (iframeDoc) {
      iframeDoc.body.innerHTML = ``;
      iframeDoc.head.innerHTML = `<meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>`;

      const styleHTMLs = [
        renderToStaticMarkup(
          <link
            rel="stylesheet"
            type="text/css"
            href="https://cdn.jsdelivr.net/npm/@splidejs/splide@3.2.2/dist/css/splide-core.min.css"
          ></link>
        ),
      ];

      styleHTMLs.forEach((styleHTMLs) => {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = styleHTMLs;
        const styleNode = tempDiv.querySelector("link");

        if (styleNode) {
          iframeDoc.head.appendChild(styleNode);
        }
      });

      styles.forEach((styleElement) => {
        const styleHTML = renderToStaticMarkup(styleElement);
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = styleHTML;
        const styleNode = tempDiv.querySelector("style");
        if (styleNode) {
          iframeDoc.head.appendChild(styleNode);
        }
      });

      components.forEach(({ component, id }) => {
        console.log(component);
        const tempDiv = document.createElement("section");
        tempDiv.setAttribute("builder-section-id", id);
        tempDiv.innerHTML = component;

        if (tempDiv) {
          iframeDoc.body.appendChild(tempDiv);
        }
      });

      scripts.forEach((scriptElement) => {
        const styleHTML = renderToString(scriptElement);
        const tempDiv = document.createElement("code");
        tempDiv.innerHTML = styleHTML;
        const scriptNode = tempDiv.querySelector("script");
        if (scriptNode) {
          iframeDoc.body.appendChild(scriptNode);
        }
      });

      setSrcDoc(iframeDoc.documentElement.outerHTML);
    }
  }, []);

  return (
    <>
        <DefaultNavigationBar></DefaultNavigationBar>

        {props.data?.flatData.sections.map((section, index) => (
          <section key={index}>
            {section.children.map((child, idx) => (
              <Renderer key={idx} {...child} />
            ))}
          </section>
        ))}

        <DefaultFooter></DefaultFooter>
       
        <style
          dangerouslySetInnerHTML={{
            __html: `
.default-tab.slide-label-app > .text-body {
    transform-origin: top;
    transform: scaleY(0);
    transition: all .2s ease;
    opacity: 0;
    max-height: 0;
    margin: 0;
    overflow: hidden;
}
.default-tab.slide-label-app.slide-label-app__active > .text-body {
    display: block;
    transform: scaleY(1);
    opacity: 1;
    max-height: 400px;
    margin-top: 8px;
}
  @media screen and (min-width: 991.1px) {
.div-block-4.splide-app-exp .splide__pagination {
    display: none;
}
}
  @media screen and (max-width: 991px) {
      .splide-app-exp .splide__pagination > li {
      width: 16px;
      height: 16px;
      flex: 0 0 16px;
      min-width: 0;
      max-width: none;
            max-height: none;
                  min-height: initial;
      }
    .splide-app-exp .splide__pagination__page {
      border-radius: 50%;
      width: 16px !important;
      height: 16px !important;
      max-width: none !important;
			max-height: none !important;
      display: inline-block;
      border: 1px solid #2f3033;
      box-shadow: inset 0 0 0 5px #f9f9f9;
      background: #2f3033;
      opacity: 0.4;
      cursor: pointer;
-webkit-appearance: none;
-moz-appearance: none;
appearance: none;
padding: 0;
margin: 0;
outline: 0;
    }
    .splide-app-exp .splide__pagination__page.is-active {
      opacity: 1;
    }
    .splide-app-exp .splide__pagination__page:hover {
      opacity: 0.7;
    }
    .splide-app-exp li.slide-label-app:not(.slide-label-app__active) {
      display: none;
    }
    .splide-app-exp .splide__pagination {
      order: -10;
      padding: 0;
      margin-top: 16px;
      gap: 4px;
    }
  }
  .splide-vital .splide__arrows {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    align-items: center;
    gap: 8px;
}
.splide-vital button.splide__arrow {border-radius: 40px;border: none;background: #424347;color: #fff;padding: 10px;width: 48px;height: 48px;display: inline-flex;align-items: center;justify-content: center;}
.splide-vital button[disabled].splide__arrow {
    opacity: 0.4;
}
.splide-vital button.splide__arrow:hover {
    opacity: 0.8;
}
.splide-vital button.splide__arrow svg {
    fill: currentColor;
    width: 16px;
}
.splide-vital button.splide__arrow.splide__arrow--prev {
    transform: rotate(180deg);
}
.lottie-ready-to-start svg {
    border: 2px solid #ebebeb;
    border-radius: 18px;
}`
          }}
        ></style>
    </>
  );
};
