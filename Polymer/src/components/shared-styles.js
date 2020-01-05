import { css } from 'lit-element';

export default css`
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
` 