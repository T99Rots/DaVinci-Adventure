import { LitElement, html, css } from 'lit-element';

class BottomSheetPage extends LitElement {
  static get styles () {
    return css`
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
        background: white;
        opacity: 0;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
      }
      #container[opened] #shim {
        opacity: 1;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
      }
      #sheet {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 64px;
        background: white;
        /* border-top-right-radius: 8px;
        border-top-left-radius: 8px; */
        transition: transform var(--toggle-transition);
        transform: translateY(100%);
        overflow: hidden;
        /* box-shadow: 
          0 6px 10px 0 rgba(0, 0, 0, 0.14),
          0 1px 18px 0 rgba(0, 0, 0, 0.12),
          0 3px 5px -1px rgba(0, 0, 0, 0.4); */
      }
      #container[opened] #sheet {
        transform: translate(0%);
      }
      @keyframes shim-open {
        0% {
          opacity: 0;
        }
        75% {
          opacity: 0;
        }
        100% {
          opacity: 1;
        }
      }
    `
  }

  render() {
    return html`
      <div id="container" ?opened="${this.opened}">
        <div id="shim"></div>
        <div id="sheet">
          <slot></slot>
        </div>
      </div>
    `
  }

  firstUpdated() {
    this._shim = this.renderRoot.getElementById('shim');
    this._sheet = this.renderRoot.getElementById('sheet');
    this.renderRoot.getElementById('container').addEventListener('transitionend', () => {
      if (!this.opened) {
        this.style.display = 'none';
      }
      this._ignoreSwipe = false;
    });
    this._shim.addEventListener('click', () => {
      this.opened = false;
      this.dispatchEvent(new CustomEvent('close'));
    });
  }

  update (changedProps) {
    if (changedProps.has('opened')) {
      const timing = {
        duration: 225,
        easing: 'ease-in-out',
        direction: this.opened? 'normal': 'reverse'
      };
      const shimKeyframes = [
        { offset: 0, opacity: 0 },
        { offset: 0.75, opacity: 0 },
        { offset: 1, opacity: 1 }
      ];
      if(this.opened) {
        this.style.display = 'block';
        this.getClientRects();
      }
      if(this._shim) this._shim.animate(shimKeyframes, timing);
    }
    super.update(changedProps);
  }

  static get properties () {
    return {
      opened: { type: Boolean, reflect: true }
    };
  }
}

window.customElements.define('bottom-sheet-page', BottomSheetPage);