import { LitElement, html, css } from 'lit-element';

class PageSlider extends LitElement {
  static get styles () {
    return css`
      :host {
        display: flex;
        width: 100%;
        overflow: hidden;
      }

      ::slotted(*) {
        width: 100%;
        flex-shrink: 0;
      }

      ::slotted(:not([selected])) {
        display: none!important;
      }
    `
  }

  render() {
    return html`
      <slot></slot>
    `
  }

  constructor() {
    super();
    this._selected = null;
    this._animations = [];
  }

  static get properties () {
    return {
      selected: { type: String }
    }
  }

  set selected (name) {
    const elem = this.querySelector(`:scope > [slide=${name}]`);
    if(!elem || elem === this._selected) return;
    
    const newIndex = elem.getAttribute('index') || 0;
    const oldIndex = this._selected? this._selected.getAttribute('index') || 0: 0; 
    const previousSelected = this._selected;

    const tr = (n) => ({ transform: `translateX(${n}%)` })

    const timing = {
      duration: 225,
      easing: 'ease-in-out'
    }

    elem.setAttribute('selected', '');

    if(this._selected) {
      for(const anim of this._animations) {
        anim.cancel();
      }

      const w = this.clientWidth;
      const sp = this._selected.getClientRects()[0].x;
      const ep = elem.getClientRects()[0].x;

      const so = sp === 0? 0: (w / sp) * 100;
      const eo = ep === 0? 0: (w / ep) * 100;

      if(newIndex >= oldIndex) {
        const anim1 = this._selected.animate([tr(0 - so), tr(-100 - so)], timing);
        const anim2 = elem.animate([tr(100 - eo), tr(0 - eo)], timing);
        anim1.onfinish = () => {
          previousSelected.removeAttribute('selected');
          this._animations = [];
        };;
        this._animations = [anim1, anim2];
      } else {
        const anim1 = this._selected.animate([tr(0 - so), tr(100 - so)], timing);
        const anim2 = elem.animate([tr(-100 - eo), tr(0 - eo)], timing);
        anim1.onfinish = () => {
          previousSelected.removeAttribute('selected');
          this._animations = [];
        };
        this._animations = [anim1, anim2];
      }
    }
    this._selected = elem;
  }

  get selected () {
    return this._selected && this._selected.getAttribute('slide');
  }
}

window.customElements.define('page-slider', PageSlider);