import { LitElement, html, css } from 'lit-element';

class BottomSheet extends LitElement {
  static get styles () {
    return [
      css`
        :host {
          --toggle-transition: 0.225s ease-in-out;
          display: none;
          position: fixed;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          z-index: 1000;
        }
        #shim {
          background: rgba(0,0,0,0.5);
          opacity: 0;
          position: fixed;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          transition: opacity var(--toggle-transition);
        }
        #container[opened] #shim {
          opacity: 1;
        }
        #sheet {
          position: fixed;
          left: 0;
          right: 0;
          bottom: 0;
          background: white;
          border-top-right-radius: 8px;
          border-top-left-radius: 8px;
          transition: transform var(--toggle-transition);
          transform: translateY(100%);
          overflow: hidden;
          box-shadow: 
            0 6px 10px 0 rgba(0, 0, 0, 0.14),
            0 1px 18px 0 rgba(0, 0, 0, 0.12),
            0 3px 5px -1px rgba(0, 0, 0, 0.4)
        }
        #container[opened] #sheet {
          transform: translateY(0%);
        }
      `
    ];
  }

  render () {
    return html`
      <div id="container" ?opened="${this.opened}">
        <div id="shim"></div>
        <div id="sheet">
          <slot></slot>
        </div>
      </div>
    `;
  }

  firstUpdated () {
    this.renderRoot.getElementById('container').addEventListener('transitionend', () => {
      if (!this.opened) {
        this.style.display = 'none';
      }
    });
    this.renderRoot.getElementById('shim').addEventListener('click', () => {
      this.opened = false;
      this.dispatchEvent(new CustomEvent('close'));
    });
  }

  update (changedProps) {
    if (changedProps.has('opened') && this.opened) {
      this.style.display = 'block';
      this.getClientRects();
    }
    super.update(changedProps);
  }

  static get properties () {
    return {
      opened: { type: Boolean, reflect: true }
    };
  }
}

window.customElements.define('bottom-sheet', BottomSheet);