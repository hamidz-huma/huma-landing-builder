"use client";
import React from "react";
import * as CSS from 'csstype';
import { codegen, Styles } from "@compai/css-gui";
export const BUILDER_IDS = {
    'DATA_ID': 'data-builder-id'
}
export const getSelectorByElementId = (id: string): string => {
    return `[${BUILDER_IDS.DATA_ID}="${id}"]`;
}

const CSS_PROP_NAMES = [
    'color',
    'border',
    'margin',
    'font',
    'font-size',
    'margin-top',
    'margin-right',
    'margin-left',
    'margin-bottom',
    'border',
    'text-align',
    'font-family',
    'font-weight',
    'line-height',
    'font-size',
    'display'
];
const selfClosingTags = new Set([
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'
]);
export const addStylesheetWithComputedStyles = (
    elementId: string
) => {
    const iframe = document.getElementsByTagName("iframe")[0];

    // Get the document of the iframe
    const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDocument) {
        console.error("Unable to access the iframe document.");
        return;
    }

    // Get the element by ID from the iframe
    // const element = iframeDocument.getElementById(elementId);
    const element = iframeDocument?.querySelectorAll(getSelectorByElementId(elementId))[0];
    if (!element) {
        console.error(`Element with ID "${elementId}" not found in the iframe.`);
        return;
    }

    // Get the computed styles of the element
    const computedStyles = getComputedStyle(element);
    const styleElementFounded = iframeDocument?.querySelector('style#builder-custom-style');
    let styleElement = styleElementFounded ? styleElementFounded : iframeDocument.createElement("style");

    if (!styleElementFounded) {
        // Create a new style element in the iframe
        styleElement.setAttribute('type', "text/css")
        styleElement.setAttribute('id', "builder-custom-style")
    }

    iframeDocument.head.appendChild(styleElement);
    const stylesheet = styleElement.sheet as CSSStyleSheet;
    // Prepare the CSS rule as a string
    let cssRule = getSelectorByElementId(elementId) + `{`;
    for (let i = 0; i < computedStyles.length; i++) {
        const propertyName = computedStyles[i];
        const propertyValue = computedStyles.getPropertyValue(propertyName);
        if (CSS_PROP_NAMES.includes(propertyName)) {
            cssRule += `${propertyName}: ${propertyValue};`;
        }
    }
    cssRule += '}';

    try {
        stylesheet.insertRule(cssRule, stylesheet.cssRules.length);
        updateCSSRulePure(stylesheet.cssRules.item(0), cssRule)
    } catch (error) {
        console.log(error)
    }

    return stylesheet.cssRules.item(0);
}

export const convertPropertiesToCSSRule = (
    properties: Styles,
): CSSStyleDeclaration | null => {
    let rule: any = {};
    for (const prop in properties) {
        if (properties.hasOwnProperty(prop)) {
            const propName = prop.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
            const value = properties[prop as keyof Styles];
            if (value) {
                rule[propName] = stringifyUnit(value)
            } else {
                delete rule[propName]
            }
        }
    }
    return rule as CSSStyleDeclaration
}
export const kebabToCamelCase = (str: string): string => {
    return str.replace(/-./g, match => match.charAt(1).toUpperCase());
}
export const convertCSSRuleToProperties = (rule: CSSStyleRule): Styles => {
    const style: Styles = {};
    if (!rule) return {}
    // Iterate over the CSSStyleRule's style properties
    for (let i = 0; i < rule.style.length; i++) {
        const propName = rule.style[i];
        // Copy each property to the CSS.PropertiesFallback object
        if (CSS_PROP_NAMES.includes(propName)) {
            try {

                const newPropName = kebabToCamelCase(propName) as keyof Styles
                const value = rule.style[newPropName] || rule.style.getPropertyValue(newPropName);
                let v: any = undefined;
                const unitMatch = value.match(/^(\d+(\.\d+)?)(px|em|rem|%)$/);
                if (unitMatch) {
                    const [, number, , unit] = unitMatch;
                    v = { value: parseFloat(number), unit: unit }
                } else {
                    v = value
                }
                if (v) {
                    if (newPropName == 'fontSize' && (value as string).includes('clamp')) { 
                    }else{
                        style[newPropName] = v
                    }

                }

            } catch (error) {
                console.log(error)
            }
        }
    }

    return style;
}

export const updateCSSRulePure = (currentRule, styleString: string) => {
    const iframe = document.getElementsByTagName("iframe")[0];
    const iframeDocument =
        iframe?.contentDocument || iframe?.contentWindow?.document;
    if (!iframeDocument) return;
    let styleEl = iframeDocument.querySelector('style#builder-custom-style');

    const styleSheet = styleEl.sheet as CSSStyleSheet;
    for (let i = 0; i < styleSheet.cssRules.length; i++) {
        const rule = styleSheet.cssRules[i];
        if (rule.selectorText === currentRule.selectorText) {
            styleSheet.deleteRule(i);
            styleSheet.insertRule(styleString, i);
            break;
        }
    }

    styleEl.innerHTML = Array.from(styleSheet.cssRules).map(s => s.cssText).join('\n')
}
export const updateCSSRule = (ruleReference: CSSStyleRule, styleString: string | null) => {
    if (!styleString) return;

    const iframe = document.getElementsByTagName("iframe")[0];
    const iframeDocument =
        iframe?.contentDocument || iframe?.contentWindow?.document;
    if (!iframeDocument) return;

    const stylesheets = iframeDocument.styleSheets;

    let cssRule;
    for (let styleSheet of stylesheets) {
        if (styleSheet) {
            try {
                for (let i = 0; i < styleSheet.cssRules.length; i++) {
                    const rule = styleSheet.cssRules[i];
                    if (rule.selectorText === `${ruleReference.selectorText}`) {
                        cssRule = rule as CSSStyleRule;
                        styleSheet.deleteRule(i);
                        styleSheet.insertRule(styleString, i);
                        const styleEl = styleSheet.ownerNode;
                        styleEl.innerHTML = Array.from(styleSheet.cssRules).map(s => s.cssText).join('\n')
                        break;
                    }
                }

            } catch (error) {
                console.log('Not Access')
            }

        }
    }


    // find stylesheet
}
export const getClassCombinations = (classes: string[]): string[] => {
    const result: string[] = [];

    // Helper function to generate combinations recursively
    function generateCombinations(prefix: string, index: number) {
        for (let i = index; i < classes.length; i++) {
            const newCombination = prefix ? `${prefix}.${classes[i]}` : `.${classes[i]}`;
            result.push(newCombination);
            generateCombinations(newCombination, i + 1);
        }
    }

    // Start generating combinations from index 0
    generateCombinations('', 0);

    return result;
}

export const getCSSRuleReferencesByClassNames = (selectors: Array<string>) => {
    return getClassCombinations(selectors).map((selector) => {
        const iframe = document.getElementsByTagName("iframe")[0];
        const iframeDocument =
            iframe?.contentDocument || iframe?.contentWindow?.document;
        if (!iframeDocument) return;

        const stylesheets = iframeDocument.styleSheets;

        let cssRule;
        for (let styleSheet of stylesheets) {
            if (styleSheet) {
                try {
                    for (let i = 0; i < styleSheet.cssRules.length; i++) {
                        const rule = styleSheet.cssRules[i];
                        if (rule.selectorText == selector) {
                            cssRule = rule as CSSStyleRule;
                            break;
                        }
                    }
                } catch (error) {
                    console.log('Not Access')
                }
            }
        }

        return cssRule
    }).filter((f) => !!f)
}

export const getCSSRuleReferencesBySelector = (selector: string) => {
    const iframe = document.getElementsByTagName("iframe")[0];
    const iframeDocument =
        iframe?.contentDocument || iframe?.contentWindow?.document;
    if (!iframeDocument) return;

    const styleElementFounded = iframeDocument?.querySelector('style#builder-custom-style');
    const styleSheet = styleElementFounded?.sheet as CSSStyleSheet;

    let cssRule;

    if (styleSheet) {
        try {
            for (let i = 0; i < styleSheet.cssRules.length; i++) {
                const rule = styleSheet.cssRules[i];
                if (rule.selectorText === selector) {
                    cssRule = rule as CSSStyleRule;
                    break;
                }
            }
        } catch (error) {
            console.log('Not Access')
        }

    }

    return cssRule
}

export const overwriteIframeStyleRule = (
    selector: string,
    newStyle,
) => {
    const iframe = document.getElementsByTagName("iframe")[0];
    const iframeDocument =
        iframe?.contentDocument || iframe?.contentWindow?.document;
    if (!iframeDocument) return;

    const styleElementFounded = iframeDocument?.querySelector('style#builder-custom-style');
    const styleSheet = styleElementFounded?.sheet as CSSStyleSheet;


    for (let i = 0; i < styleSheet.cssRules.length; i++) {
        const rule = styleSheet.cssRules[i];
        if (rule.selectorText === selector) {
            const cssRule = rule as CSSStyleRule;


            // Overwrite the existing rule with new styles
            for (const [property, value] of Object.entries(newStyle)) {
                if (Number.isInteger(property)) {
                    cssRule.style[cssRule.style[property]] = value as string;
                }
            }
            break;
        }
    }

}

export const getStylesFromIframe = (iframeRef: React.RefObject<HTMLIFrameElement>, classList: DOMTokenList) => {
    const classNames = Array.from(classList)
    if (!iframeRef || !iframeRef.current || !iframeRef.current.contentWindow) return;

    const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
    const styles = [];

    // Get all stylesheets in the iframe
    const stylesheets = iframeDoc.styleSheets;

    // Iterate through each stylesheet
    for (let sheet of stylesheets) {
        try {
            const rules = sheet.cssRules || [];

            // Iterate through each rule in the stylesheet
            for (let rule of rules) {
                if (rule.selectorText) {
                    // Check if the rule's selector matches any of the class names
                    const selectors = rule.selectorText.split(',').map(selector => selector.trim());
                    for (let selector of selectors) {
                        if (classNames.some(cls => selector.includes(`.${cls}`))) {
                            styles.push({
                                selector: rule.selectorText,
                                style: rule.style.cssText
                            });
                        }
                    }
                }
            }
        } catch (e) {
            console.error('Error accessing stylesheet rules:', e);
        }
    }

    return styles;
}

export const updateElementStyle = (elementReference, newStyles) => {
    const { element, computedStyle } = elementReference;

    // Apply new styles
    for (const [property, value] of Object.entries(newStyles)) {
        element.style[property] = value;

        // Optionally update the stored computed styles (if needed)
        computedStyle[property] = value;
    }
}

export const getElementStyleReferences = (iframeRef: React.RefObject<HTMLIFrameElement>, classList: DOMTokenList) => {
    const classNames = Array.from(classList)
    if (!iframeRef || !iframeRef.current || !iframeRef.current.contentWindow) return;

    const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;


    const elementsWithStyles = [];

    // Query all elements that match the class list
    const elements = iframeDoc.querySelectorAll(classNames.map(cls => `.${cls}`).join(', '));

    elements.forEach(element => {
        const computedStyle = iframeDoc.defaultView?.getComputedStyle(element);
        const styleObject = {};
        if (!iframeDoc.defaultView || !computedStyle) return;

        // Store computed styles as key-value pairs
        for (let i = 0; i < computedStyle.length; i++) {
            const prop = computedStyle[i];
            styleObject[prop] = computedStyle.getPropertyValue(prop);
        }

        elementsWithStyles.push({
            element,  // Reference to the actual DOM element
            classList: element.className,
            computedStyle: styleObject,
        });
    });

    return elementsWithStyles;
}

export const generateHtmlString = (reactElement, attributes) => {
    if (!React.isValidElement(reactElement)) {
        return '';
    }

    const { children, ...otherProps } = attributes;

    // Create a string for the attributes
    const attrString = Object.entries(otherProps)
        .filter(([key, value]) => typeof value !== 'symbol' && value != null) // Exclude Symbols and nullish values
        .map(([key, value]) => `${key}="${String(value)}"`) // Convert value to string
        .join(' ');

    if (selfClosingTags.has(reactElement.type)) {
        return `<${reactElement.type} ${attrString.replace('className', 'class')}>`;
    }

    // Create a string for the children
    let childrenString = '';

    if (Array.isArray(children)) {
        childrenString = children.map(child =>
            React.isValidElement(child)
                ? generateHtmlString(child, child.props)
                : String(child) // Convert non-element children to string
        ).join('');
    } else if (React.isValidElement(children)) {
        childrenString = generateHtmlString(children, children.props);
    } else if (children != null) {
        childrenString = String(children); // Convert non-element children to string
    }

    return `<${reactElement.type} ${attrString.replace('className', 'class')}>${childrenString}</${reactElement.type}>`;
};

export const stringifyUnit = (value: any) => {
    if (typeof value === 'object' && value.unit) {
        if (value.unit == 'number') return value.value
        return value.value + value.unit
    }
    return value
}

