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
import { codegen, Editor, Fieldset, Inputs } from "@compai/css-gui";
import { defaultTheme } from "@/lib/default-theme";

export const ComponentStyles: React.FC = () => {
  const currentRule = useAppSelector((state) => state.app.selectedElementStyle);
  const selectedElement = useAppSelector((state) => state.app.selectedElement);

  const [value, setValue] = useState<any>(null);
  useEffect(() => {
    if (!currentRule) return;
    const v = convertCSSRuleToProperties(currentRule);
    setValue(v);
    return;
  }, [selectedElement]);

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
                  updateCSSRulePure(currentRule,codegen.css(value,{selector:currentRule.selectorText}))
                }}
              >
              </Editor>
            </>
          ) : (
            <></>
          )}
          {/* {rulesWithReferences.map((rule, index) => {
            if (!rule) return null;

            const value = convertCSSRuleToProperties(rule.rule);
            return (
              <div
                key={`${rule.selector}+${index}`}
                style={{ backgroundColor: "#e8e8e8", padding: "8px" }}
              >
                <h1>{rule.selector}</h1>
                <Editor
                  showRegenerate={false}
                  key={`editor-${rule.selector}+${index}`}
                  theme={defaultTheme}
                  styles={value}
                  onChange={(newStyle) => {
                    updateCSSRule(
                      rulesWithReferences[index],
                      convertPropertiesToCSSRule(newStyle)
                    );
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gap: ".5rem",
                      borderRightWidth: "1px",
                      borderRightStyle: "solid",
                      borderColor: "border",
                      padding: 4,
                    }}
                  >
                    <h3>Typography</h3>
                    <Inputs.FontSize />
                    <Inputs.LineHeight />
                    <Inputs.TextAlign />
                    <Inputs.FontFamily />
                    <h3>Colors</h3>
                    <Inputs.Color />
                    <Inputs.BackgroundColor />
                    <Inputs.Flex />
                    <Inputs.Margin />
                    <Inputs.Padding />
                    <Inputs.Border />
                    <Inputs.BorderRadius />
                    <Inputs.AlignItems />
                    <Inputs.JustifyContent />
                    <Inputs.FlexDirection />
                    <Inputs.BackgroundImage />
                  </div>
                </Editor>
              </div>
            );
          })} */}
        </>
      </form>
    </div>
  );
};
