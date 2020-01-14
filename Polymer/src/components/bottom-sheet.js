import { LitElement, html, css } from 'lit-element';
import { attachGestureObserver } from '../touch-gestures';

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
            0 3px 5px -1px rgba(0, 0, 0, 0.4);
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
    this._shim = this.renderRoot.getElementById('shim');
    this._sheet = this.renderRoot.getElementById('sheet');
    this.renderRoot.getElementById('container').addEventListener('transitionend', () => {
      if (!this.opened) {
        this.style.display = 'none';
      }
      this._ignoreSwipe = false;
    });
    this.renderRoot.getElementById('shim').addEventListener('click', () => {
      this.opened = false;
      this.dispatchEvent(new CustomEvent('close'));
    });
    attachGestureObserver(this, { swipeRegisterThreshold: 10 });
    this.addEventListener('vertical-swipe', e => this._onSwipe(e))
    this.addEventListener('tab', e => {
      if(e.clientY < window.innerHeight - this._sheet.clientHeight && !this._ignoreSwipe) {
        this._ignoreSwipe = true;
        this.opened = false;
        this.dispatchEvent(new CustomEvent('close'));     
      }
    });
  }

  _onSwipe(e) {
    if(this._ignoreSwipe) return;
    this._sheet.style.transitionDuration = '0ms';
    this._shim.style.transitionDuration = '0ms';
    this._lastSwipe = e;
    this._moves = [];

    const getMomentum = (lastMove) => {
      let lastMatchingMove;
      for(let i = 0; i < this._moves.length; i++) {
        const m = this._moves[this._moves.length - 1 - i];
        if(m.timeStamp > lastMove.timeStamp - 150) {
          lastMatchingMove = m;
        } else {
          break;
        }
      }
      if(lastMatchingMove) {
        const timeSpan = lastMove.timeStamp - lastMatchingMove.timeStamp;
        const pxMoved = lastMove.movedY - lastMatchingMove.movedY;
        return (1000 / timeSpan) * pxMoved;
      } else {
        return 0;
      }
    }

    const getEndMomentum = () => {
      const lastMove = this._moves[this._moves.length - 1];
      let highestMomentum = 0;
      for(let i = 0; i < this._moves.length; i++) {
        const m = this._moves[this._moves.length - 1 - i];
        if(m.timeStamp > lastMove.timeStamp - 75) {
          if(
            (
              (m.momentum > 0 && lastMove.momentum > 0)
              ||(m.momentum < 0 && lastMove.momentum < 0)
            ) 
            && Math.abs(m.momentum) > Math.abs(highestMomentum)
          ) highestMomentum = m.momentum;
        } else {
          break;
        }
      }
      return highestMomentum;
    }

    const a = (e) => {
      this._moved
      this._openedPercent = Math.max(e.movedY / this._sheet.clientHeight, 0);
      this._sheet.style.transform = `translateY(${this._openedPercent*100}%)`;
      this._shim.style.opacity = 1 - this._openedPercent;
      e.momentum = getMomentum(e);
      this._moves.push(e);
    }

    e.on('update', a);
 
    e.on('end', (e) => {
      a(e);
      this._ignoreSwipe = true;
      let momentum = getEndMomentum();
      if(this._openedPercent === 0) {
        this._ignoreSwipe = false;
        return;
      }
      if(this._openedPercent > 1) {
        this.opened = false;
        this.style.display = 'none';
        this._ignoreSwipe = false;
        this._sheet.style.transitionDuration = '';
        this._shim.style.transitionDuration = '';   
        this._sheet.style.transform = '';
        this._shim.style.opacity = '';
        this.dispatchEvent(new CustomEvent('close'));
        return;
      }
      // if momentum above threshold close or open based on direction of momentum, 
      // else close or open based on percentage already opened or closed
      const closing = momentum > -1000 && momentum < 1200? this._openedPercent > 0.5: momentum > 0; 
      let lastRender = Date.now();
      let percentOpened = this._openedPercent; // set the percent the sheet is opened
      let pxOpened = this._openedPercent * this._sheet.clientHeight; // set the amount of pixels the sheet is opened
      const render = () => {
        const sheetHeight = this._sheet.clientHeight
        const timePassed = Date.now() - lastRender; // get time passed in ms since last render
        const g = (a,b,c) => ((a * c) + (b * (1 - c)));
        if(closing) { 
          // if the sheet is closing change the momentum to speed up towards set target
          if(momentum < 2000) {
            momentum = g(2000, momentum, Math.min(Math.max(1 - (percentOpened * 3), .1), 1));
          }
        } else { 
          // if the sheet is opening speed the momentum up to set target speed in the first 75%
          // and then slow it to a near stop in the last 25%
          const a = Math.min(percentOpened * 4,1);
          if(a < 1 || momentum > -2000) {
            const b = g(2000, (200), a);
            momentum = g(momentum, -b, Math.min(percentOpened * 2, 0.9));
          }
        }
        // based on how much time passed between frames, add momentum to current position
        pxOpened+= (timePassed * momentum) / 1000;
        let finished = false;
        if(closing) { // if the sheet is down by more pixels then it's high, consider it closed
          if(pxOpened > sheetHeight) {
            finished = true;
            pxOpened = sheetHeight;
            percentOpened = 1;
          } else {
            percentOpened = pxOpened / sheetHeight;
          }
        } else { // if the sheet is not moved down at all anymore consider it opened
          if(pxOpened < 0) {
            pxOpened = 0;
            finished = true;
            percentOpened = 0;
          } else {
            percentOpened = pxOpened / sheetHeight;
          }
        }
        this._sheet.style.transform = `translateY(${Math.floor(pxOpened)}px)`;
        this._shim.style.opacity = Math.max(1 - percentOpened, 0);
        if(finished) {
          requestAnimationFrame(() => {
            if(closing) {
              this.opened = false;
              this.style.display = 'none';
              this._ignoreSwipe = false;
              this._sheet.style.transitionDuration = '';
              this._shim.style.transitionDuration = '';
              this._sheet.style.transform = '';
              this._shim.style.opacity = '';
              this.dispatchEvent(new CustomEvent('close'));     
            } else {
              this._ignoreSwipe = false;
              this._sheet.style.transitionDuration = '';
              this._shim.style.transitionDuration = '';
              this._sheet.style.transform = '';
              this._shim.style.opacity = '';
            }
          });
        } else {
          requestAnimationFrame(() => render());
        }
        lastRender = Date.now();
      }
      requestAnimationFrame(() => render());
    })
    a(e);
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