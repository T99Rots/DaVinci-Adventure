import { css } from 'lit-element';

export default css`
  * {
    -webkit-tap-highlight-color: rgba(0,0,0,0);
  }
  :host {
    --app-primary-color: #45a086;
    --app-secondary-color: #5ab4dd;
    font-family: Roboto;
  }
  :host(.page) {
    padding-top: 64px;
  }
  paper-button.fancy-btn {
    position: relative;
    padding: 12px 44px;
    background: linear-gradient(193deg, #98cb95, #328f7f);
    color: white;
    border-radius: 21px;
    transform-style: preserve-3d;
    font-weight: 600;
    font-size: 16px;
    transition: 0.3s ease-out;
    transition-property: opacity, filter;
  }
  paper-button.fancy-btn::before {
    opacity: 0;
    background: linear-gradient(193deg, #98cb95, #328f7f);
    filter: blur(15px);
    border-radius: 26px;
    position: absolute;
    top: -5px;
    left: -5px;
    bottom: -5px;
    right: -5px;
    content: '';
    transform: translateZ(-1px);
    transition: 0.3s opacity ease-out;
  }
  paper-button.fancy-btn:hover:not([disabled])::before {
    opacity: 1;
  }
  paper-button.fancy-btn[disabled] {
    filter: grayscale(1);
    opacity: 0.6;
  }
  paper-button.primary-btn {
    font-size: 16px;
    line-height: 18px;
    border-radius: 21.5px;
    padding: 12px 25px;
    background: linear-gradient(193deg, #98cb95, #328f7f);
    color: white;
    /* padding:  */
    font-weight: 600;
  }
  paper-button.secondary-btn {
    line-height: 18px;
    padding: 10px 23px;
    position: relative;
    border: 2px solid transparent;
    border-radius: 21px;
    background: white;
    background-clip: padding-box;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 600;
    transform-style: preserve-3d;
  }
  paper-button.secondary-btn::before {
    position: absolute;
    top: -2px; bottom: -2px;
    left: -2px; right: -2px;
    background: linear-gradient(193deg, #98cb95, #328f7f);
    content: '';
    z-index: -1;
    border-radius: 21px;
    transform: translateZ(-1px);
  }
  [hidden] {
    display: none!important;
  }
  .card {
    border-radius: 4px;
    box-shadow: var(--shadow-elevation-4dp);
    background: white;
  }
`

export const shadows = css`
  :host {
    --shadow-elevation-2dp: 
      0 2px 2px 0 rgba(0, 0, 0, 0.14),
      0 1px 5px 0 rgba(0, 0, 0, 0.12),
      0 3px 1px -2px rgba(0, 0, 0, 0.2);
    --shadow-elevation-3dp: 
      0 3px 4px 0 rgba(0, 0, 0, 0.14),
      0 1px 8px 0 rgba(0, 0, 0, 0.12),
      0 3px 3px -2px rgba(0, 0, 0, 0.4);
    --shadow-elevation-4dp: 
      0 4px 5px 0 rgba(0, 0, 0, 0.14),
      0 1px 10px 0 rgba(0, 0, 0, 0.12),
      0 2px 4px -1px rgba(0, 0, 0, 0.4);
    --shadow-elevation-6dp: 
      0 6px 10px 0 rgba(0, 0, 0, 0.14),
      0 1px 18px 0 rgba(0, 0, 0, 0.12),
      0 3px 5px -1px rgba(0, 0, 0, 0.4);
    --shadow-elevation-8dp: 
      0 8px 10px 1px rgba(0, 0, 0, 0.14),
      0 3px 14px 2px rgba(0, 0, 0, 0.12),
      0 5px 5px -3px rgba(0, 0, 0, 0.4);
    --shadow-elevation-12dp: 
      0 12px 16px 1px rgba(0, 0, 0, 0.14),
      0 4px 22px 3px rgba(0, 0, 0, 0.12),
      0 6px 7px -4px rgba(0, 0, 0, 0.4);
    --shadow-elevation-16dp: 
      0 16px 24px 2px rgba(0, 0, 0, 0.14),
      0  6px 30px 5px rgba(0, 0, 0, 0.12),
      0  8px 10px -5px rgba(0, 0, 0, 0.4);
    --shadow-elevation-24dp: 
      0 24px 38px 3px rgba(0, 0, 0, 0.14),
      0 9px 46px 8px rgba(0, 0, 0, 0.12),
      0 11px 15px -7px rgba(0, 0, 0, 0.4);
  }
  [elevation]:not([disable-shadow-transition]) {
    transition: box-shadow 0.28s cubic-bezier(0.4, 0, 0.2, 1);
  }
  [elevation="2"] {
    box-shadow: var(--shadow-elevation-2dp);
  }
  [elevation="3"] {
    box-shadow: var(--shadow-elevation-3dp);
  }
  [elevation="4"] {
    box-shadow: var(--shadow-elevation-4dp);
  }
  [elevation="6"] {
    box-shadow: var(--shadow-elevation-6dp);
  }
  [elevation="8"] {
    box-shadow: var(--shadow-elevation-8dp);
  }
  [elevation="12"] {
    box-shadow: var(--shadow-elevation-12dp);
  }
  [elevation="16"] {
    box-shadow: var(--shadow-elevation-16dp);
  }
  [elevation="24"] {
    box-shadow: var(--shadow-elevation-24dp);
  }
`