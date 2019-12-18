import { LitElement, html, css } from 'lit-element';

class ViewContainer extends LitElement {
  static get styles () {
    return [
      css`
        .page:not([active]) {
          display: none!important;
        }
      `
    ];
  }

  render () {
    if (this.page && !(this.page in this._pageElements)) {
      const element = document.createElement(this.page);
      element.className = 'page';
      this._pageElements[this.page] = element;
    }

    for (const [tagName, page] of Object.entries(this._pageElements)) {
      if (tagName === this.page) {
        page.setAttribute('active', '');
      }
      else {
        page.removeAttribute('active');
      }
    }

    return html`
      ${Object.values(this._pageElements)}
    `;
  }

  static get properties () {
    return {
      page: { type: String }
    };
  }

  constructor () {
    super();
    this._pageElements = {};
  }
}

customElements.define('view-container', ViewContainer);