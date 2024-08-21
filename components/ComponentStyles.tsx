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
} from "@/lib/utils";
import { Editor, Fieldset, Inputs } from "@compai/css-gui";
import { defaultTheme } from "@/lib/default-theme";

export const ComponentStyles: React.FC = () => {
  const rulesWithReferences = useAppSelector(
    (state) => state.app.rulesWithReferences
  );

  return (
    <div style={{}}>
      <h3>Styles</h3>
      <form>
        <>
          {rulesWithReferences.map((rule, index) => {
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
                  </div>
                </Editor>
              </div>
            );
          })}
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
          >
            Save
          </button>
        </>
      </form>
    </div>
  );
};
