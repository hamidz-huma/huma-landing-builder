export class MyCustomElement extends HTMLElement {
    constructor() {
      super();
      // Attach a shadow DOM tree to the instance
      const shadow = this.attachShadow({ mode: 'open' });
  
      // Create a paragraph element
      const paragraph = document.createElement('p');
      paragraph.textContent = 'Hello, I am a custom element!';
  
      // Append the paragraph to the shadow root
      shadow.appendChild(paragraph);
    }
  
    connectedCallback() {
      // Called when the element is inserted into the DOM
    }
  
    disconnectedCallback() {
      // Called when the element is removed from the DOM
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
      // Called when an attribute is added, removed, or changed
    }
  
    static get observedAttributes() {
      return ['my-attribute']; // List of attributes to monitor
    }
  }
  
  customElements.define('my-custom-element', MyCustomElement);
