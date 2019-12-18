import { LitElement, html, css } from 'lit-element';

const repeat = (n, callback) => {
  const result = [];
  for(let i = 0; i < n; i++) {
    result.push(callback(i));
  }
  return result;
}

class PaperPincode extends LitElement {
  static get styles () {
    return css`
      :host {
        display: block;
      }
      #container {
        display: flex;
        position: relative;
      }
      .inp-display {
        width: 40px;
        height: 40px;
        line-height: 40px;
        background: #ddd;
        border-radius: 5px;
        text-align: center;
        font-size: 30px;
        font-family: Roboto;
      }
      .inp-display:not(:first-child) {
        margin-left: 6px;
      }
      #input {
        opacity: 0;
      }
      input {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        color: transparent;
        text-shadow: 0 0 0 #2196f3;
      }
      input:focus {
        outline: none;
      }
    `
  }

  render() {
    return html`
      <div id="container">
        ${repeat(this.length || 6, (i) => html`
          <div class="inp-display">${this.value[i]}</div>
        `)}
        <input
          id="input"
          type="number"
          @input="${e => this._onInput(e)}">
      </div>
    `
  }

  static get properties() {
    return {
      length: { type: Number },
      value: { type: String }
    }
  }

  constructor() {
    super();
    this.value = '';
  }

  _onInput(e) {
    const elem = e.path[0];
    const value = elem.value.toString().replace(/[^\d]/g, '').slice(0, this.length);
    elem.value = value;
    this.value = value;
  }
}

window.customElements.define('paper-pincode', PaperPincode);