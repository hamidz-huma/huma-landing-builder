"use client";
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
import { registerComponent } from "./../lib/webComponents/paragraph";
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
      const elementToUpdate = iframeDoc?.querySelector(
        getSelectorByElementId(element.props[BUILDER_IDS.DATA_ID])
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

  useEffect(() => {
    const iframe = iframeRef.current;

    // Ensure the listener is added after the iframe has loaded
    const handleLoad = () => {
      const iframeDoc =
        iframe?.contentDocument || iframe?.contentWindow?.document;

      if (iframeDoc) {
        iframeDoc.body.addEventListener("click", handleElementClick);
        if (!iframeDoc.getElementById("builder-hover-menu")) {
          hoverMenu = document.createElement("div");
          hoverMenu.setAttribute("id", "builder-hover-menu");
          iframeDoc.documentElement.appendChild(hoverMenu);
        }

        iframeDoc.body.addEventListener("dragstart", handleDragStart);
        iframeDoc.body.addEventListener("dragover", handleDragOver);
        iframeDoc.body.addEventListener("dragleave", handleDragLeave);
        iframeDoc.body.addEventListener("drop", handleDrop);

        iframe?.contentWindow?.addEventListener("message", (e) => {
          const { source, message } = e.data;
          if (source == "parent") {
            if (message.type === "add-section") {
              const selectedElement = iframeDoc?.body;
              const elementToAdd = message.data.content;
              const parser = new DOMParser();
              const doc = parser.parseFromString(elementToAdd, "text/html");
              const htmlNode = doc.body.firstChild;
              if (!htmlNode) return;

              selectedElement.appendChild(htmlNode);
            }
            if (message.type == "add") {
              const selectedElement = iframeDoc?.querySelector(
                getSelectorByElementId(message.data.selectedElementId)
              );
              if (!selectedElement || !selectedElement.parentNode) return;
              const elementToAdd = message.data.content;
              const parser = new DOMParser();
              const doc = parser.parseFromString(elementToAdd, "text/html");
              const htmlNode = doc.body.firstChild;
              if (!htmlNode) return;

              selectedElement.parentNode.insertBefore(
                htmlNode,
                selectedElement.nextElementSibling
              );

              console.log(selectedElement, message.data.content);
            }
          }
        });
      }
    };

    const handleMouseOver = (event) => {
      const elementMoveOver = event.target as Element;
      const { x, y } = getElementPosition(elementMoveOver);

      const iframeDoc =
        iframe?.contentDocument || iframe?.contentWindow?.document;
      if (iframeDoc) {
        iframeDoc
          ?.querySelectorAll(".drag-hover")
          .forEach((el) => el.classList.remove("drag-hover"));

        const hoverMenu = iframeDoc.getElementById("builder-hover-menu");
        if (hoverMenu) {
          hoverMenu.innerHTML = `<div style="display:flex">
          <span class="builder-add-element">+</span>
          <span class="builder-add-element"><></span>
          <span  class="builder-add-element">${elementMoveOver.tagName}</span>
          </div>`;
          hoverMenu.setAttribute(
            "style",
            `position: absolute; top: ${y - 35}px; left: ${x}px; `
          );
        }
      }

      elementMoveOver.classList.add("drag-hover");
    };

    const handleElementClick = (event) => {
      console.log(event.target);
      if (!event) return;
      event.preventDefault();
      event.stopPropagation();
      const selectedElement = event.target as Element;
      if (event.target.tagName == 'BODY') return;

      const newID = selectedElement.hasAttribute(BUILDER_IDS.DATA_ID)
        ? selectedElement.getAttribute(BUILDER_IDS.DATA_ID) || uuidv4()
        : uuidv4();

      // if (["SECTION"].includes(selectedElement.tagName)) return;

      // remove all item with selecte-item class
      const iframeDoc =
        iframe?.contentDocument || iframe?.contentWindow?.document;
      if (!iframeDoc) return;
      const selectedItems = iframeDoc.querySelectorAll(
        `[${BUILDER_IDS.DATA_ID}]`
      );

      // Remove each selected element
      selectedItems.forEach((item) => {
        // item.removeAttribute(BUILDER_IDS.DATA_ID);
        item.removeAttribute("draggable");
      });

      selectedElement.setAttribute(BUILDER_IDS.DATA_ID, newID);
      selectedElement.setAttribute("draggable", "true");

      const hoverMenu = iframeDoc.getElementById("builder-hover-menu");
      console.log(hoverMenu);
      if (hoverMenu) {
        const { x, y } = getElementPosition(selectedElement);
        hoverMenu.innerHTML = `<div>
          <span class="builder-add-element">+</span>
          <span class="builder-add-element">c</span>
          <span class="builder-add-element">-</span>
          <span  class="builder-add-element">${selectedElement.tagName}</span>
          </div>`;
        hoverMenu.setAttribute(
          "style",
          `position: absolute; top: ${y - 35}px; left: ${x}px`
        );

        const elAdd = hoverMenu.getElementsByClassName(
          "builder-add-element"
        )[0];

        const elCopy = hoverMenu.getElementsByClassName(
          "builder-add-element"
        )[1];

        const elDelete = hoverMenu.getElementsByClassName(
          "builder-add-element"
        )[2];

        elCopy.addEventListener("click", (e) => {
          const iframe = document.getElementsByTagName("iframe")[0];
          const iframeDoc =
            iframe?.contentDocument || iframe?.contentWindow?.document;
          if (!iframeDoc) return;
          // const elToClone = iframeDoc.getElementById(`${newID}`);
          const elToClone = selectedElement;

          const divElement = elToClone?.cloneNode(true) as Element;
          divElement.removeAttribute(BUILDER_IDS.DATA_ID);
          divElement.removeAttribute("draggable");
          if (!divElement) return;
          selectedElement?.parentNode?.insertBefore(divElement, elToClone);
          dispatch(setSelectedElement(selectedElement.outerHTML));
        });

        elDelete.addEventListener("click", (e) => {
          const iframe = document.getElementsByTagName("iframe")[0];
          const iframeDoc =
            iframe?.contentDocument || iframe?.contentWindow?.document;
          if (!iframeDoc) return;
          // const elToDelete = iframeDoc.getElementById(`${newID}`);
          const elToDelete = selectedElement;
          if (elToDelete) {
            elToDelete.remove();
            dispatch(setSelectedElement(null));
          }
        });

        elAdd.addEventListener("click", (e) => {
          const iframe = document.getElementsByTagName("iframe")[0];

          if (!iframe.contentWindow) return;
          const message: IFrameMessage = {
            source: "iframe",
            message: {
              type: "open-add-new-element-dialog",
              data: {
                selectedElementId: newID,
              },
            },
          };

          iframe.contentWindow.parent.postMessage(message, "*");
        });
      }

      const cssRule = getCSSRuleReferencesBySelector(
        getSelectorByElementId(newID)
      );

      if (!cssRule) {
        const r = addStylesheetWithComputedStyles(newID);
        dispatch(setSelectedElementStyle(r));
      } else {
        dispatch(setSelectedElementStyle(cssRule));
      }

      const rulesWithReferences = getCSSRuleReferencesByClassNames(
        Array.from(selectedElement.classList)
      );
      dispatch(setRulesWithReferences(rulesWithReferences));

      dispatch(setSelectedElement(selectedElement.outerHTML));

      // onElementSelect(selectedElement);
    };

    // Add load event listener to ensure the iframe is fully loaded before attaching the click listener
    iframe?.addEventListener("load", handleLoad);

    return () => {
      if (iframe) {
        iframe.removeEventListener("load", handleLoad);

        // Cleanup: Remove the click listener if it was attached
        const iframeDoc =
          iframe.contentDocument || iframe?.contentWindow?.document;
        if (iframeDoc) {
          iframeDoc.body.removeEventListener("mouseover", handleMouseOver);

          iframeDoc.body.removeEventListener("dragstart", handleDragStart);
          iframeDoc.body.removeEventListener("dragover", handleDragOver);
          iframeDoc.body.removeEventListener("dragleave", handleDragLeave);
          iframeDoc.body.removeEventListener("drop", handleDrop);
          // iframeDoc.body.removeEventListener("click", handleElementClick);
        }
      }
    };
  }, []);

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

export const Canvas = (props: {
  cssString: any;
  humaCssString: any;
  data: any;
}) => {
  const sections: Array<any> = props.data?.flatData.sections;
  const header = props.data?.flatData?.header;
  const message = useAppSelector((state) => state.app.message);
  const [srcDoc, setSrcDoc] = useState<string>();
  const [modalIsOpen, setIsOpen] = useState(false);
  const [selectedElementId, setSelectedElementId] = useState<string>();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (message?.message.type == "open-add-new-element-dialog") {
      const id = message?.message.data.selectedElementId;
      openElementSelectorDialog(id);
    }
  }, [message]);

  const openElementSelectorDialog = (id: string) => {
    setSelectedElementId(id);
    setIsOpen(true);
  };

  const afterOpenModal = () => {
    // references are now sync'd and can be accessed.
    console.log("closed");
  };

  const closeModal = (value: string) => {
    const iframe = document.getElementsByTagName("iframe")[0];
    if (!iframe.contentWindow) return;
    const message: IFrameMessage = {
      source: "parent",
      message: {
        type: "add",
        data: {
          selectedElementId,
          content: value || `<div>EMPTY</div>`,
        },
      },
    };

    iframe.contentWindow.postMessage(message, "*");

    setIsOpen(false);
  };

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

  // const addComponent = useCallback((type: string) => {
  //   let component;
  //   switch (type) {
  //     case ItemTypes.SECTION:
  //       component = <SectionComponent />;
  //       break;
  //     case ItemTypes.DIV:
  //       component = <DivComponent />;
  //       break;
  //     case ItemTypes.CLOCK:
  //       component = <Clocks />;
  //       break;
  //     case ItemTypes.HERO:
  //       component = <Hero />;
  //       break;
  //     default:
  //       return;
  //   }
  //   setComponents((prev) => [
  //     ...prev,
  //     { id: `${prev.length + 1}`, type, component },
  //   ]);
  // }, []);

  const scripts = [
    <script
      key={"0"}
      src="https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=6684599c709edcc788d9219e"
      type="text/javascript"
      integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0="
      crossOrigin="anonymous"
    />,

    <script
      key={"1"}
      src="https://cdn.prod.website-files.com/6684599c709edcc788d9219e/js/landing-page-huma-workspace.016285210.js"
      type="text/javascript"
    />,
    <script
      key={"2"}
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
    // <style
    //   type="text/css"
    //   key={"1"}
    //   dangerouslySetInnerHTML={{ __html: props.cssString }}
    // />,
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

    dispatch(setFlatData(props.data?.flatData));

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
        // const styleHTML = renderToStaticMarkup(component);
        const tempDiv = document.createElement("section");
        tempDiv.setAttribute("builder-section-id", id);
        tempDiv.classList.add("hc-waitlist-page-section");
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

  //@ts-ignore
  const handleElementSelect = (element: Element) => {
    // Make some changes - for example, change the text color
    // if (!element.hasAttribute("id")) {
    // element.setAttribute("id", uuidv4());
    // element.setAttribute("draggable", "true");
    // }
  };

  return (
    <>
      <IframeComponent
        srcDoc={srcDoc}
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
        style={{
          padding: "20px",
          width: "100%",
          height: "100%",
          overflowY: "auto",
        }}
      />
      <my-component />
      <Modal
        isOpen={modalIsOpen}
        style={customStyles}
        contentLabel="Element Selector"
        onAfterOpen={afterOpenModal}
        onRequestClose={() => closeModal("<div></div>")}
      >
        <div>
          <div>
            <h2>Heading</h2>
            <button onClick={() => closeModal("<h1>Sample Heading 1</h1>")}>
              Heading 1
            </button>
            <button onClick={() => closeModal("<h2>Sample Heading 2</h2>")}>
              Heading 2
            </button>
            <h2>Paragrapgh</h2>
            <button onClick={() => closeModal("<p>Sample Paragraph</p>")}>
              Paragrapgh
            </button>
            <h2>Image</h2>
            <button
              onClick={() =>
                closeModal(
                  "<img width='200px' height='200px' src='https://placehold.co/200x200/png'/>"
                )
              }
            >
              Image
            </button>
          </div>
          {/*

            slider-component
              slider-1,slider-2, 

            form-component
            hero-component

            content-component
            
            footer-component

            ...
            nav-bar

            
            next, genAI, 

          */}
          <div>
            <h2>Template</h2>
            <button
              onClick={() =>
                closeModal(
                  `<section class="hc-waitlist-page-section centered section-with-no-margin overflow-hidden vitals-section">
    <div class="section-content-wrapper vertical left cards">
      <div class="div-block-5 vitals-widget-container">
        <div class="section-header long">
          <h2 class="heading-4 sliderrrheading">Choose from all-inclusive widgets</h2>
        </div>
        <div class="div-block-4 splide-vital">
          <div class="splide__track vitals-slide-track">
            <ul role="list" class="splide__list">
              <li class="splide__slide vital-slidesmall">
                <div class="tab-content-wrapper">
                  <div class="slide-content-wrapper small">
                    <div class="slide-img-wrapper small"><img src="images/symptoms-updated_1.avif" loading="lazy" alt="" class="slide-img small"></div>
                    <div class="card-copy-content">
                      <h3 class="heading-3">Symptoms</h3>
                      <p class="text-caption">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod temincididunt ut labore et dolore</p>
                    </div>
                  </div>
                </div>
              </li>
              <li class="splide__slide vital-slidesmall">
                <div class="tab-content-wrapper">
                  <div class="slide-content-wrapper small">
                    <div class="slide-img-wrapper small"><img src="images/medications-updated_1.avif" loading="lazy" alt="" class="slide-img small"></div>
                    <div class="card-copy-content">
                      <h3 class="heading-3">Medications</h3>
                      <p class="text-caption">Medications widget tracks and manages medication regimens, including dose, schedule and adherence to ensure effective treatment and compliance.</p>
                    </div>
                  </div>
                </div>
              </li>
              <li class="splide__slide vital-slidelarge">
                <div class="tab-content-wrapper">
                  <div class="slide-content-wrapper">
                    <div class="slide-img-wrapper large"><img src="images/health-coach_1.avif" loading="lazy" alt="" class="slide-img large"></div>
                    <div class="card-copy-content">
                      <h3 class="heading-3">Health coach</h3>
                      <p class="text-caption">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod temincididunt ut labore et dolore</p>
                    </div>
                  </div>
                </div>
              </li>
              <li class="splide__slide vital-slidelarge">
                <div class="tab-content-wrapper">
                  <div class="slide-content-wrapper">
                    <div class="slide-img-wrapper large"><img src="images/learn_1.avif" loading="lazy" alt="" class="slide-img large"></div>
                    <div class="card-copy-content">
                      <h3 class="heading-3">Featured articles</h3>
                      <p class="text-caption">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod temincididunt ut labore et dolore</p>
                    </div>
                  </div>
                </div>
              </li>
              <li class="splide__slide vital-slidesmall">
                <div class="tab-content-wrapper">
                  <div class="slide-content-wrapper small">
                    <div class="slide-img-wrapper small"><img src="images/oxygen-saturation_1.avif" loading="lazy" alt="" class="slide-img small"></div>
                    <div class="card-copy-content">
                      <h3 class="heading-3">Oxygen Saturation</h3>
                      <p class="text-caption">Oxygen Saturation widget enables users to record and track oxygen levels in their blood to monitor their respiratory health. </p>
                    </div>
                  </div>
                </div>
              </li>
              <li class="splide__slide vital-slidesmall">
                <div class="tab-content-wrapper">
                  <div class="slide-content-wrapper small">
                    <div class="slide-img-wrapper small"><img src="images/sleep_1.avif" loading="lazy" alt="" class="slide-img small"></div>
                    <div class="card-copy-content">
                      <h3 class="heading-3">Sleep</h3>
                      <p class="text-caption">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod temincididunt ut labore et dolore</p>
                    </div>
                  </div>
                </div>
              </li>
              <li class="splide__slide vital-slidelarge">
                <div class="tab-content-wrapper">
                  <div class="slide-content-wrapper">
                    <div class="slide-img-wrapper large"><img src="images/blood-pressure_1.avif" loading="lazy" alt="" class="slide-img large"></div>
                    <div class="card-copy-content">
                      <h3 class="heading-3">Blood Pressure</h3>
                      <p class="text-caption">The Blood Pressure widget allows users to record and track systolic and diastolic blood pressure readings.</p>
                    </div>
                  </div>
                </div>
              </li>
              <li class="splide__slide vital-slidesmall">
                <div class="tab-content-wrapper">
                  <div class="slide-content-wrapper small">
                    <div class="slide-img-wrapper small"><img src="images/reminders_1.avif" loading="lazy" alt="" class="slide-img small"></div>
                    <div class="card-copy-content">
                      <h3 class="heading-3">Reminders</h3>
                      <p class="text-caption">Reminders widget gives the ability to users to keep track of their health related tasks with timely notifications and alerts. </p>
                    </div>
                  </div>
                </div>
              </li>
              <li class="splide__slide vital-slidelarge">
                <div class="tab-content-wrapper">
                  <div class="slide-content-wrapper">
                    <div class="slide-img-wrapper large"><img src="images/epros_2.avif" loading="lazy" alt="" class="slide-img large"></div>
                    <div class="card-copy-content">
                      <h3 class="heading-3">ePROs</h3>
                      <p class="text-caption">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod temincididunt ut labore et dolore</p>
                    </div>
                  </div>
                </div>
              </li>
              <li class="splide__slide vital-slidelarge">
                <div class="tab-content-wrapper">
                  <div class="slide-content-wrapper">
                    <div class="slide-img-wrapper large"><img src="images/pdf_1.avif" loading="lazy" alt="" class="slide-img large"></div>
                    <div class="card-copy-content">
                      <h3 class="heading-3">PDF summary report</h3>
                      <p class="text-caption">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod temincididunt ut labore et dolore</p>
                    </div>
                  </div>
                </div>
              </li>
              <li class="splide__slide vital-slidesmall">
                <div class="tab-content-wrapper">
                  <div class="slide-content-wrapper small">
                    <div class="slide-img-wrapper small"><img src="images/helper_1.avif" loading="lazy" alt="" class="slide-img small"></div>
                    <div class="card-copy-content">
                      <h3 class="heading-3">Helper</h3>
                      <p class="text-caption">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod temincididunt ut labore et dolore</p>
                    </div>
                  </div>
                </div>
              </li>
              <li class="splide__slide vital-slidelarge">
                <div class="tab-content-wrapper">
                  <div class="slide-content-wrapper">
                    <div class="slide-img-wrapper large"><img src="images/air-quality_1.avif" loading="lazy" alt="" class="slide-img large"></div>
                    <div class="card-copy-content">
                      <h3 class="heading-3">Air quality</h3>
                      <p class="text-caption">The Air Quality widget monitors and records air quality metrics to help assess environmental factors based on geolocation.</p>
                    </div>
                  </div>
                </div>
              </li>
              <li class="splide__slide vital-slidesmall">
                <div class="tab-content-wrapper">
                  <div class="slide-content-wrapper small">
                    <div class="slide-img-wrapper small"><img src="images/profile-updated_1.avif" loading="lazy" alt="" class="slide-img small"></div>
                    <div class="card-copy-content">
                      <h3 class="heading-3">Patient profile</h3>
                      <p class="text-caption">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod temincididunt ut labore et dolore</p>
                    </div>
                  </div>
                </div>
              </li>
              <li class="splide__slide vital-slide-extra-large">
                <div class="tab-content-wrapper">
                  <div class="slide-content-wrapper">
                    <div class="slide-img-wrapper large and-more-wrapper"><img src="images/more_1.avif" loading="lazy" alt="" class="slide-img large extra-large">
                      <div class="text-block-5 and-more-text">and more ...</div>
                    </div>
                    <div class="card-copy-content">
                      <h3 class="heading-3">50+ more widgets within Huma Builder</h3>
                      <p class="text-caption">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod temincididunt ut labore et dolore</p>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>`
                )
              }
            >
              Heading 1
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
