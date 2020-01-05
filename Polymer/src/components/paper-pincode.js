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
        display: flex;
        flex-direction: column;
        justify-content: center;
        --paper-pincode-active-color: #6200ee;
        --paper-pincode-error-color: #b00020;
        --paper-pincode-placeholder-color: rgba(0, 0, 0, 0.6);
      }
      :host(:focus-within) p {
        color: var(--paper-pincode-active-color);
      }
      :host(:focus-within) input {
        border-color: rgba(0, 0, 0, 0.87);
      }
      p {
        margin: 0;
        padding-bottom: 5px;
        font-size: 14px;
        text-align: center;
        color: var(--paper-pincode-placeholder-color);
        font-family: Roboto;
      }
      #container {
        display: flex;
        position: relative;
      }
      input {
        width: 40px;
        height: 40px;
        line-height: 40px;
        border: 1px solid rgba(0, 0, 0, 0.38);
        padding: 1px;
        border-radius: 4px;
        text-align: center;
        font-size: 30px;
        font-family: Roboto;
      }
      input:focus {
        border-width: 2px;
        border-color: var(--paper-pincode-active-color)!important;
        padding: 0;
      }
      input:not(:first-child) {
        margin-left: 6px;
      }
      #input {
        opacity: 0;
      }
      input:focus {
        outline: none;
      }
      input:invalid {
        border-color: var(--paper-pincode-error-color)!important;
      }
      #container[valid]:focus-within input {
        border-color: var(--paper-pincode-active-color);
      }
      [hidden] {
        display: none!important;
      }
    `
  }

  render() {
    return html`
      <p ?hidden="${!this.label}">${this.label}</p>
      <div id="container">
        ${repeat(this.length || 6, (i) => html`
          <input 
            maxlength="1"
            inputmode="numeric"
            value="${this._value[i] || ''}"
            pattern="[0-9]*"
            @keydown="${e => this._onKeyDown(e)}"
            @keyup="${e => this._onKeyUp(e, i)}"
            @input="${e => this._onInput(e, i)}"
            @click=${e => this._onClick(e)}>
          </input>
        `)}
      </div>
    `
  }

  static get properties() {
    return {
      length: { type: Number },
      value: { type: String },
      label: { type: String }
    }
  }

  constructor() {
    super();
    this._value = [];
    this.length = this.length || 6;
  }

  get value() {
    let str = '';
    for(let i = 0; i < this.length; i++) {
      str+= this._value[i] || ' ';
    }
    return str;
  }

  set value(newVal) {
    const oldVal = this.value;
    if(typeof newVal !== 'string') return;
    const arr = new Array(this.length);
    for(let i = 0; i < Math.min(newVal.length, this.length); i++) {
      if(Number.isNaN(+newVal[i])) return;
      arr[i] = newVal[i];
    }
    this._value = arr;
    this.requestUpdate('value', oldVal);
  }

  get isValid () {
    for(let i = 0; i < this.length; i++) {
      if(Number.isNaN(+this._value[i])) return false;
    }
    return true;
  }

  _onInput(e, i) {
    const wasValid = this.isValid;
    const elem = e.path[0];
    const next = elem.nextElementSibling;

    if(e.inputType === 'insertText') {
      if(next) {
        next.focus();
        next.selectionStart = 0;
        next.selectionEnd = 1;
      };
      this._value[i] = e.data;
    } else if (e.inputType.includes('delete')) {
      delete this._value[i];
    }
    this.dispatchEvent(new CustomEvent('value-changed', { detail: { value: this.value, isValid: this.isValid } }));
    if(this.isValid !== wasValid) {
      const container = this.renderRoot.getElementById('container');
      if(wasValid) {
        container.removeAttribute('valid');
      } else {
        container.setAttribute('valid', '');
      }
    }
  }

  _onKeyUp(e, i) {
    const elem = e.path[0];
    const previous = elem.previousElementSibling;
    if(e.key === 'Backspace') {
      if(previous) {
        previous.focus();
        previous.selectionStart = 0;
        previous.selectionEnd = 1;
      }
    }
  }

  _onKeyDown(e) {
    const elem = e.path[0];
    const next = elem.nextElementSibling;
    const previous = elem.previousElementSibling;

    if(e.key === 'ArrowRight' && next) {
      next.focus();
      requestAnimationFrame(() => {
        next.selectionStart = 0;
        next.selectionEnd = 1;
      });
    };
    if(e.key === 'ArrowLeft' && previous) {
      previous.focus();
      requestAnimationFrame(() => {
        previous.selectionStart = 0;
        previous.selectionEnd = 1;
      });
    };
  }

  _onClick(e) {
    const elem = e.path[0];
    elem.selectionStart = 0;
    elem.selectionEnd = 1;
  }
}

window.customElements.define('paper-pincode', PaperPincode);