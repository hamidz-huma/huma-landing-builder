"use client";
import React, { useState, useCallback, useRef, useEffect } from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from "../constants";
import { SectionComponent, DivComponent, Clocks, Hero } from "./index";
import { renderToStaticMarkup, renderToString } from "react-dom/server";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import {
  setSelectedElement,
  setSelectedElementStyle,
} from "@/lib/store/canvasSlice";
import { v4 as uuidv4 } from "uuid";
import parse from "html-react-parser";
import {
  addStylesheetWithComputedStyles,
  generateHtmlString,
  getCSSRuleReferencesBySelector,
  getSelectorByElementId,
} from "@/lib/utils";
import {
  getElementPosition,
  handleDragLeave,
  handleDragOver,
  handleDragStart,
  handleDrop,
} from "@/lib/drag-drop-utils";
interface CanvasComponent {
  id: string;
  type: string;
  component: JSX.Element;
}
//@ts-ignore
export const IframeComponent = ({ srcDoc, onElementSelect, ...props }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const dispatch = useAppDispatch();
  const selectedElement = useAppSelector((state) => state.app.selectedElement);
  let hoverMenu: HTMLDivElement | null = null;
  useEffect(() => {
    const iframe = document.getElementsByTagName("iframe")[0];
    const iframeDoc = iframe.contentDocument;
    if (!selectedElement || typeof selectedElement !== "string") return;
    if (iframeDoc) {
      if (!iframeDoc.getElementById("builder-hover-menu")) {
        hoverMenu = document.createElement("div");
        hoverMenu.setAttribute("id", "builder-hover-menu");
        iframeDoc.documentElement.appendChild(hoverMenu);
      }
    }

    const element = parse(selectedElement);

    if (!React.isValidElement(element)) return;

    const getAttributes = (
      reactElement: string | React.JSX.Element | React.JSX.Element[] | null
    ) => {
      if (React.isValidElement(reactElement)) {
        return reactElement.props;
      }
      return null;
    };

    const attributes = getAttributes(element);

    const attributeValues = attributes
      ? Object.fromEntries(
          Object.entries(attributes).map(([key, value]) => [key, value])
        )
      : {};

    if (iframe && iframeDoc) {
      // Find the element by ID
      const elementToUpdate = iframeDoc?.querySelectorAll(
        getSelectorByElementId(element.props["data-builder-id"])
      )[0];

      if (elementToUpdate && iframeDoc) {
        // Replace the entire element with new content
        elementToUpdate.outerHTML = generateHtmlString(
          element,
          attributeValues
        ); // Add your new content
        // Replace the old element with the new one
        // elementToUpdate.replaceWith(newElement);
      }
    }

    const elements = iframeDoc?.querySelectorAll(".huma-builder-selected-item");
    elements?.forEach((element) => {
      element.addEventListener("dragstart", handleDragStart);
      element.addEventListener("dragover", handleDragOver);
      element.addEventListener("dragleave", handleDragLeave);
      element.addEventListener("drop", handleDrop);
    });
  }, [selectedElement]);

  useEffect(() => {
    const iframe = iframeRef.current;

    // Ensure the listener is added after the iframe has loaded
    const handleLoad = () => {
      const iframeDoc =
        iframe?.contentDocument || iframe?.contentWindow?.document;

      if (iframeDoc) {
        iframeDoc.body.addEventListener("click", handleElementClick);
        // iframeDoc.body.addEventListener("mouseover", handleMouseOver);
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
            `position: absolute; top: ${y}px; left: ${x}px; background-color: lightgreen;color: white`
          );
          const elAdd = hoverMenu.getElementsByClassName(
            "builder-add-element"
          )[0];
          const editAdd = hoverMenu.getElementsByClassName(
            "builder-add-element"
          )[1];

          elAdd.addEventListener("click", (e) => {
            const divElement = document.createElement("div");

            divElement.innerHTML = "New Element";

            elementMoveOver.appendChild(divElement);
          });
        }
      }

      elementMoveOver.classList.add("drag-hover");
    };

    const handleElementClick = (event) => {
      if (!event) return;
      event.preventDefault();
      event.stopPropagation();
      const selectedElement = event.target as Element;

      const newID = selectedElement.hasAttribute("data-builder-id")
        ? selectedElement.getAttribute("data-builder-id") || uuidv4()
        : uuidv4();

      // if (["SECTION"].includes(selectedElement.tagName)) return;

      // remove all item with selecte-item class
      const iframeDoc =
        iframe?.contentDocument || iframe?.contentWindow?.document;
      if (!iframeDoc) return;
      const selectedItems = iframeDoc.querySelectorAll(
        ".huma-builder-selected-item"
      );

      // Remove each selected element
      selectedItems.forEach((item) => {
        item.classList.remove("huma-builder-selected-item");

        item.removeAttribute("draggable");
      });

      selectedElement.classList.add("huma-builder-selected-item");
      selectedElement.setAttribute("data-builder-id", newID);
      selectedElement.setAttribute("draggable", "true");


      // const rulesWithReferences = getCSSRuleReferences(
      //   iframeRef,
      //   selectedElement.classList
      // );

      const hoverMenu = iframeDoc.getElementById("builder-hover-menu");
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
          `position: absolute; top: ${
            y - 25
          }px; left: ${x}px; background-color: lightgreen;color: white`
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
          const elToClone = iframeDoc?.querySelectorAll(
            getSelectorByElementId(newID)
          )[0];

          const divElement = elToClone?.cloneNode(true);
          if (!divElement) return;
          elToClone?.parentNode?.insertBefore(divElement, elToClone);
          dispatch(setSelectedElement(selectedElement.outerHTML));
        });

        elDelete.addEventListener("click", (e) => {
          const iframe = document.getElementsByTagName("iframe")[0];
          const iframeDoc =
            iframe?.contentDocument || iframe?.contentWindow?.document;
          if (!iframeDoc) return;
          // const elToDelete = iframeDoc.getElementById(`${newID}`);
          const elToDelete = iframeDoc?.querySelectorAll(
            getSelectorByElementId(newID)
          )[0];
          if (elToDelete) {
            elToDelete.remove();
            dispatch(setSelectedElement(null));
          }
        });
        
        elAdd.addEventListener("click", (e) => {
          const iframe = document.getElementsByTagName("iframe")[0];
          const iframeDoc =
            iframe?.contentDocument || iframe?.contentWindow?.document;
          if (!iframe.contentWindow) return;

          iframe.contentWindow.postMessage("click", "*");

          const divElement = document.createElement("div");
          divElement.innerHTML = "New Element";
          selectedElement.appendChild(divElement);
          dispatch(setSelectedElement(selectedElement.outerHTML));
        });
      }

      const { cssRule } = getCSSRuleReferencesBySelector(
        getSelectorByElementId(newID)
      );

      if (!cssRule) {
        const r = addStylesheetWithComputedStyles(newID);
        dispatch(setSelectedElementStyle(r));
      }else{
        dispatch(setSelectedElementStyle(cssRule));
      }
      dispatch(setSelectedElement(selectedElement.outerHTML));

      onElementSelect(selectedElement);

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
          iframeDoc.body.removeEventListener("click", handleElementClick);
        }
      }
    };
  }, [onElementSelect]);

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
  const items = Object.values(ItemTypes);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [srcDoc, setSrcDoc] = useState<string>();
  const [{ isOver }, drop] = useDrop(() => ({
    accept: items,
    drop: (item: { type: string }) => addComponent(item.type),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const headerComponent: CanvasComponent = {
    id: `${0}`,
    type: ItemTypes.SECTION,
    component: (
      <section
        key={header.id}
        dangerouslySetInnerHTML={{ __html: header.content }}
      />
    ),
  };

  const sectionsComponent = sections
    ? sections.map((value, index) => {
        const component: CanvasComponent = {
          id: `${index + 1}`,
          type: ItemTypes.SECTION,
          component: (
            <section
              key={value.id}
              dangerouslySetInnerHTML={{ __html: value.content }}
            />
          ),
        };
        return component;
      })
    : [];

  const [components, setComponents] = useState<CanvasComponent[]>([
    headerComponent,
    ...sectionsComponent,
  ]);

  const addComponent = useCallback((type: string) => {
    let component;
    switch (type) {
      case ItemTypes.SECTION:
        component = <SectionComponent />;
        break;
      case ItemTypes.DIV:
        component = <DivComponent />;
        break;
      case ItemTypes.CLOCK:
        component = <Clocks />;
        break;
      case ItemTypes.HERO:
        component = <Hero />;
        break;
      default:
        return;
    }
    setComponents((prev) => [
      ...prev,
      { id: `${prev.length + 1}`, type, component },
    ]);
  }, []);

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
        z-index: 10000
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
             border: 1px dashed lightgreen;
            }
        .placeholder {
            background-color: rgba(0, 255, 0, 0.2);
            border: 2px dashed green;
            position: absolute;
        }
    .huma-builder-selected-item {
     border: 1px dashed #cd3c4a;
    border-radius: 5px;
      cursor: move;
    }
    `,
      }}
    />,
    <style
      type="text/css"
      key={"1"}
      dangerouslySetInnerHTML={{ __html: props.cssString }}
    />,
    ...props.data?.flatData?.styles.map(
      (styleString: { style: string }, index: number) => {
        return (
          <style
            key={index + 2}
            type="text/css"
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
      iframeDoc.head.innerHTML = `<style id="builder-custom-style"></style>`;

      const styleHTMLs = [
        renderToStaticMarkup(
          <link
            rel="stylesheet"
            type="text/css"
            href="https://cdn.jsdelivr.net/npm/@splidejs/splide@3.2.2/dist/css/splide-core.min.css"
          ></link>
        ),
        renderToStaticMarkup(
          <link
            rel="stylesheet"
            type="text/css"
            href="https://cdn.prod.website-files.com/6684599c709edcc788d9219e/css/landing-page-huma-workspace.b0981047a.min.css"
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
        const styleHTML = renderToStaticMarkup(component);
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = styleHTML;
        const styleNode = tempDiv.querySelector("section");
        styleNode?.setAttribute("builder-section-id", id);
        if (styleNode?.firstElementChild) {
          iframeDoc.body.appendChild(styleNode);
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
    <IframeComponent
      srcDoc={srcDoc}
      sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
      onElementSelect={handleElementSelect}
      style={{
        padding: "20px",
        width: "100%",
        height: "100%",
        overflowY: "auto",
      }}
    />
  );
};
