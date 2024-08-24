"use client";

import React, { useEffect, useState } from "react";
import { useDrag } from "react-dnd";
import { ItemTypes } from "../constants";
import { Clocks, DivComponent, Hero, SectionComponent } from ".";
import { exportHTML } from "@/exportHtml";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import parse from "html-react-parser";
import { setSelectedElement } from "@/lib/store/canvasSlice";
import {
  convertCSSRuleToProperties,
  convertPropertiesToCSSRule,
  generateHtmlString,
  updateCSSRule,
  updateCSSRulePure,
} from "@/lib/utils";
import { codegen, Editor, Fieldset, Inputs, Styles } from "@compai/css-gui";
import { defaultTheme } from "@/lib/default-theme";

export const ComponentStyles: React.FC = () => {
  const currentRule = useAppSelector((state) => state.app.selectedElementStyle);
  const selectedElement = useAppSelector((state) => state.app.selectedElement);
  const rulesWithReferences = useAppSelector(
    (state) => state.app.rulesWithReferences
  );

  const [value, setValue] = useState<any>(null);
  const [values, setValues] = useState<Array<string>>([]);

  const setValueByIndex = (value, index) => {
    const newValues = [...values];
    newValues[index] = value;
    setValues(newValues);
  };

  useEffect(() => {
    if (!currentRule) return;
    const v = convertCSSRuleToProperties(currentRule);
    setValue(v);

    return;
  }, [selectedElement]);

  useEffect(() => {
    if (!rulesWithReferences) return;
    const uniqueSet = new Set<any>(
      rulesWithReferences.map((rule) => {
        const value = convertCSSRuleToProperties(rule);
        return value;
      })
    );
    
    setValues([...Array.from(uniqueSet)]);

  }, [rulesWithReferences]);

  return (
    <div style={{}}>
      <h3>Styles</h3>
      <form>
        <>
          {currentRule ? (
            <>
              <h1>{currentRule.selectorText}</h1>
              <Editor
                showRegenerate={false}
                key={`editor-${currentRule.selectorText}`}
                theme={defaultTheme}
                styles={value}
                onChange={(newStyle) => {
                  setValue(newStyle);
                  updateCSSRulePure(
                    currentRule,
                    codegen.css(value, { selector: currentRule.selectorText })
                  );
                }}
              ></Editor>
            </>
          ) : (
            <></>
          )}
         
            <>
              {rulesWithReferences.map((rule, index) => {
                return (
                  <div
                    key={`editor-2-${rule.selectorText}-${index}`}
                    style={{ backgroundColor: "#e8e8e8", padding: "8px" }}
                  >
                    <h1>{rule.selectorText}</h1>
                    <Editor
                      showRegenerate={false}
                      key={`editor-inside-${rule.selectorText}-${index}`}
                      theme={defaultTheme}
                      styles={values[index]}
                      onChange={(newStyle) => {
                        setValueByIndex(newStyle, index);
                        updateCSSRule(
                          rule,
                          codegen.css(values[index], {
                            selector: rule.selectorText,
                          })
                        );
                      }}
                    ></Editor>
                  </div>
                );
              })}
            </>
        </>
      </form>
    </div>
  );
};
