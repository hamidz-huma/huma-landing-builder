export class MyCustomElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    if (!this.shadowRoot) return
    this.shadowRoot.innerHTML = `
    <div class="my-component">
      <h1>Hello, Web Components!</h1>
      <p>This is a simple example of a web component.</p>
    </div>
  `;
  }
  }
  

  export const registerComponent = () => {
    try {
      if (typeof window === 'undefined') return;
      console.log(window.customElements.get('my-contianer'));
      if (!window.customElements.get('my-contianer')) {
        window.customElements.define('my-component', MyCustomElement);
      }
    } catch (error) {
      console.error(error);
    }
  };
  