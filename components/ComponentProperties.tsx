"use client";

import React, { useEffect, useState } from "react";
import { useDrag } from "react-dnd";
import { ItemTypes } from "../constants";
import { Clocks, DivComponent, Hero, SectionComponent } from ".";
import { exportHTML } from "@/exportHtml";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import parse from "html-react-parser";
import { setSelectedElement } from "@/lib/store/canvasSlice";
import { generateHtmlString } from "@/lib/utils";

export const ComponentProperties: React.FC = () => {
  const selectedElement = useAppSelector((state) => state.app.selectedElement);
  const dispatch = useAppDispatch();
  const [currentElement, setCurrentElement] =
    useState<React.JSX.Element | null>(null);
  // Initialize state for each attribute
  const [attributeValues, setAttributeValues] = useState<any>(null);

  useEffect(() => {
    if (!selectedElement) return;
    const element = parse(selectedElement) as unknown as React.JSX.Element;
    
    setCurrentElement(element);

    const getAttributes = (
      reactElement: string | React.JSX.Element | React.JSX.Element[] | null
    ) => {
      if (React.isValidElement(reactElement)) {
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
      if (name == 'children' && typeof current.children == "string") {
        current.children = value;
        setAttributeValues(current);
        return current;
      }

      if (name.includes('children')) {

        while (props.length > 0) {
          const key = props.shift();
          if (key) current.children[key] = value;
        }
        setAttributeValues(current);
        return current;
      }

      if (name.includes('children') && Array.isArray(current.children)) {
        current.children[props[0]] = value;
        
      }
      current[name] = value
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

  const renderForm = (reactElement: React.JSX.Element, attributes, path = "") => {
    const { children } = reactElement.props;
    return (
      <div>
        <h2>Element {`<${reactElement.type}/>`}</h2>
        <h2>{`id: ${reactElement.props.id}`}</h2>

        {Object.entries(attributes).filter(([key,value])=> key!='id').map(([key, value]) => {
          if (key === "children" &&  React.isValidElement(reactElement)) {
            return (!Array.isArray(children) && 
            <div key={key}>
            <label>
              {key}
              <textarea
                className="block w-full rounded-md border-0 py-1.5 pl-3 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                type="text"
                name={key}
                value={value}
                onChange={(e) => handleChange(e, key)}
              />
            </label>
          </div>
          )
          }
          // if (typeof value == "string" || !value) return null;
          if (React.isValidElement(reactElement)) {
            return (
              <div key={path + key}>
                <label>
                  {key}
                  <textarea
                    className="block w-full rounded-md border-0 py-1.5 pl-3 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    type="text"
                    name={key}
                    disabled={key === "data-builder-id" ? true : false}
                    value={value}
                    onChange={(e) => handleChange(e, path + key)}
                  />
                </label>
              </div>
            );
          }
        })}
        
        {Array.isArray(children) && React.Children.map(children, (child, index) => {
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
                    type="text"
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

  return (
    <div
      style={{

      }}
    >
      <div>
        <button
          type="button"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={exportHTML}
        >
          Export HTML
        </button>
      </div>
      <h3>Properties</h3>
      <form onSubmit={handleSubmit}>
        {currentElement ? 
        <>
        {renderForm(currentElement, attributeValues) }
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded">Save</button>

        </>
        : <></>}
      </form>
    </div>
  );
};
