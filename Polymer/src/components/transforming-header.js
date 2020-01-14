import { LitElement, html, css } from 'lit-element';

class TransformingHeader extends LitElement {
  static get styles () {
    return [
      css`
        :host {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 64px;
          z-index: 1;
          pointer-events: none;
        }

        header {
          margin: 8px 10px;
          background: white;
          border-radius: 8px;
          box-shadow: 0px 0px 4.5px rgba(0,0,0,0.5);
          text-align: center;
          font-size: 18px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 48px;
          padding: 0 6px;
          pointer-events: all;
        }

        :host(:not([floating])) header {
          box-shadow: none;
        }

        :host(:not([floating])) {
          border-bottom: 1px solid #ddd;
          pointer-events: all;
        }
      `
    ];
  }

  render () {
    return html`
      <header>
        <slot></slot>
      </header>
    `;
  }

  update(changedProps) {
    if(changedProps.has('floating')) {
      const timing = {
        duration: 225,
        easing: 'ease-in-out',
        direction: this.floating? 'reverse': 'normal'
      };
      const containerKeyframes = [
        { offset: 0, borderColor: 'rgba(0,0,0,0)' },
        { offset: 0.75, borderColor: 'rgba(0,0,0,0)' },
        { offset: 1, borderColor: '#ddd' }
      ];
      const headerKeyframes = [
        { offset: 0, boxShadow: '0px 0px 4.5px rgba(0,0,0,0.5)' },
        { offset: 0.75, boxShadow: '0px 0px 4.5px rgba(0,0,0,0.5)' },
        { offset: 1, boxShadow: 'none' }
      ]
      const header = this.renderRoot.querySelector('header');
      if(header) {
        header.animate(headerKeyframes, timing);
        this.animate(containerKeyframes, timing);
      }
    }
    super.update(changedProps);
  }

  static get properties () {
    return {
      floating: { type: Boolean, reflect: true }
    };
  }
}

customElements.define('transforming-header', TransformingHeader);