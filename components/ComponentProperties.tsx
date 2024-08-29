"use client";

import React, { useEffect, useState } from "react";
import { useDrag } from "react-dnd";
import { ItemTypes } from "../constants";
import { Clocks, DivComponent, Hero, SectionComponent } from ".";
import { exportHTML } from "@/exportHtml";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import parse from "html-react-parser";
import { setSelectedElement } from "@/lib/store/canvasSlice";
import { addNewEmptySection, BUILDER_IDS, generateHtmlString } from "@/lib/utils";
import { IFrameMessage } from "./Canvas";

export const ComponentProperties: React.FC = () => {
  const selectedElement = useAppSelector((state) => state.app.selectedElement);
  const dispatch = useAppDispatch();
  const [currentElement, setCurrentElement] =
    useState<React.JSX.Element | null>(null);
  // Initialize state for each attribute
  const [attributeValues, setAttributeValues] = useState<any>(null);
  const flatData = useAppSelector((state) => state.app.flatData);
  useEffect(() => {
    if (!selectedElement) return;
    const element = parse(selectedElement) as unknown as React.JSX.Element;

    setCurrentElement(element);

    const getAttributes = (
      reactElement: string | React.JSX.Element | React.JSX.Element[] | null
    ) => {
      if (React.isValidElement(reactElement)) {
        if (reactElement.type == "img") {
          type ImgProps = React.ImgHTMLAttributes<HTMLImageElement>;
          const actualProps = reactElement.props as ImgProps;
          return { ...actualProps, alt: undefined, src: undefined };
        }
        return reactElement.props;
      }
      return null;
    };

    const attributes = getAttributes(element);

    setAttributeValues(
      attributes
        ? Object.fromEntries(
            Object.entries(attributes).map(([key, value]) => [key, value])
          )
        : {}
    );
  }, [selectedElement]);

  const handleChange = (e: any, path: string) => {
    const { name, value } = e.target;
    const updateValue = (current, path: string) => {
      const props = path.split(".");
      // let current = obj;
      if (name == "children" && typeof current.children == "string") {
        current.children = value;
        setAttributeValues(current);
        return current;
      }

      if (name.includes("children")) {
        while (props.length > 0) {
          const key = props.shift();
          if (key) current.children[key] = value;
        }
        setAttributeValues(current);
        return current;
      }

      if (name.includes("children") && Array.isArray(current.children)) {
        current.children[props[0]] = value;
      }
      current[name] = value;
      setAttributeValues(current);

      return current;
    };

    const newValues = { ...attributeValues };
    updateValue(newValues, path);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedHtmlString = generateHtmlString(
      currentElement,
      attributeValues
    );
    dispatch(setSelectedElement(updatedHtmlString));
    // You can now use the updated HTML string in your application
  };

  const renderForm = (
    reactElement: React.JSX.Element,
    attributes,
    path = ""
  ) => {
    const { children } = reactElement.props;
    return (
      <div>
        <h2>Element {`<${reactElement.type}/>`}</h2>
        <h2>{`id: ${reactElement.props.id}`}</h2>

        {Object.entries(attributes)
          .filter(([key, value]) => key != "id")
          .map(([key, value]) => {
            if (key === "children" && React.isValidElement(reactElement)) {
              return (
                !Array.isArray(children) && (
                  <div key={key}>
                    <label>
                      {key}
                      <input
                        className="block w-full rounded-md border-0 py-1.5 pl-3 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        type="text"
                        name={key}
                        value={value as string}
                        onChange={(e) => handleChange(e, key)}
                      />
                    </label>
                  </div>
                )
              );
            }
            // if (typeof value == "string" || !value) return null;
            if (React.isValidElement(reactElement)) {
              return (
                <div key={path + key}>
                  <label>
                    {key}
                    <input
                      className="block w-full rounded-md border-0 py-1.5 pl-3 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      type="text"
                      name={key}
                      disabled={key === BUILDER_IDS.DATA_ID ? true : false}
                      value={value as string}
                      onChange={(e) => handleChange(e, path + key)}
                    />
                  </label>
                </div>
              );
            }
          })}

        {Array.isArray(children) &&
          React.Children.map(children, (child, index) => {
            if (typeof child === "string" && child.length) {
              return (
                <div key={index + "value"}>
                  <label>
                    {Array.isArray(children)
                      ? `${path}children.${index}`
                      : `children`}
                    <textarea
                      className="block w-full rounded-md border-0 py-1.5 pl-3 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      name={
                        Array.isArray(children)
                          ? `${path}children.${index}`
                          : `children`
                      }
                      value={child}
                      onChange={(e) =>
                        handleChange(
                          e,
                          Array.isArray(children)
                            ? `${path}children.${index}`
                            : `children`
                        )
                      }
                    />
                  </label>
                </div>
              );
            }
          })}
      </div>
    );
  };

  const addNewSection=()=>{
    addNewEmptySection()
  }

  return (
    <div style={{}}>
      <div>
        <button
          type="button"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={exportHTML}
        >
          Export HTML
        </button>
      </div>
      <h3>Sections</h3>

      <div>
        <ul>
          {flatData.sections &&
            flatData.sections.map((s, idx) => {
              return <li key={idx}>section {idx}</li>;
            })}
        </ul>
        <button
          type="button"
          className="bg-blue-500 hover:bg-blue-200 text-white font-sm py-1 px-4 rounded"
          onClick={()=>addNewSection()}
        >
          Add Section
        </button>
      </div>

      <h3>Properties</h3>
      <form onSubmit={handleSubmit}>
        {currentElement ? (
          <>
            {renderForm(currentElement, attributeValues)}
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
            >
              Save
            </button>
          </>
        ) : (
          <></>
        )}
      </form>
    </div>
  );
};
