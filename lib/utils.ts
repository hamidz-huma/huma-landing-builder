"use client";
import React from "react";
import * as CSS from 'csstype';
import { Styles } from "@compai/css-gui";


const selfClosingTags = new Set([
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'
]);

export const getCSSRuleReferences = (iframeRef: React.RefObject<HTMLIFrameElement>, classList: DOMTokenList) => {
    const classNames = Array.from(classList)
    if (!iframeRef || !iframeRef.current || !iframeRef.current.contentWindow) return;

    const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
    const rulesWithReferences = [];

    // Get all stylesheets in the iframe
    const stylesheets = iframeDoc.styleSheets;

    // Iterate through each stylesheet
    for (let sheet of stylesheets) {
        try {
            const rules = sheet.cssRules || [];

            // Iterate through each rule in the stylesheet
            for (let rule of rules) {
                if (rule.selectorText && classNames.filter(item => item != 'huma-builder-selected-item').some(cls => rule.selectorText.includes(cls))) {
                    rulesWithReferences.push({
                        rule, // Reference to the actual CSSRule
                        selector: rule.selectorText,
                        style: rule.style,
                    });
                }
            }
        } catch (e) {
            console.error('Error accessing stylesheet rules:', e);
        }
    }

    return rulesWithReferences;
}

export const convertPropertiesToCSSRule = (
    properties: Styles,
): CSSStyleRule | null => {
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
    return rule
}
export const convertCSSRuleToProperties = (rule: CSSStyleRule): Styles => {
    const style: Styles = {};
    if (!rule) return {}
    // Iterate over the CSSStyleRule's style properties
    for (let i = 0; i < rule.style.length; i++) {
        const propName = rule.style[i];
        // Copy each property to the CSS.PropertiesFallback object
        if (propName as keyof Styles != undefined && propName == 'color') {
            try {
                style[propName as keyof Styles] = rule.style.getPropertyValue(propName);
            } catch (error) {
                console.log(error)
            }
        }
    }

    return style;
}

export const updateCSSRule = (ruleReference, newStyles) => {
    const iframe = document.getElementsByTagName("iframe")[0];
    const iframeDoc = iframe.contentDocument;
    const { rule } = ruleReference;
    // Update the rule's style properties in the iframe's stylesheet
    for (const [property, value] of Object.entries(newStyles)) {
        rule.style.setProperty(property, value);
    }

    // // Force the iframe to re-render to reflect changes (optional, if needed)
    // iframeDoc.body.style.display = 'none';
    // iframeDoc.body.offsetHeight; // Trigger a reflow
    // iframeDoc.body.style.display = '';

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

