import { LitElement, html, css } from 'lit-element';
import { repeat } from 'lit-html/directives/repeat';

import '@polymer/paper-radio-button';
import '@polymer/paper-radio-group';

import sharedStyles from './shared-styles';

class EventCard extends LitElement {
  static get styles () {
    return [
      sharedStyles,
      css`
        :host {
          border-bottom: 1px solid #ddd;
          padding-bottom: 20px;
          display: block;
        }

        h3 {
          margin: 25px 20px 10px;
          font-size: 18px;
          color: #555;
        }

        p {
          margin: 10px 20px 10px;
        }

        paper-radio-group {
          display: flex;
          flex-direction: column;
        }

        paper-radio-button {
          padding-left: 30px;
          padding-right: 30px;
          --paper-radio-button-checked-color: var(--app-primary-color);
        }
      `
    ];
  }

  render () {
    return html`
      <h3>${this.event.title}</h3>
      <p ?hidden="${!this.event.body}">
        ${this.event.body}
      </p>
      ${this.event.type === 'question'? html`
        <paper-radio-group selected="${this.event.answer}">
          ${repeat(this.event.choices, choice => choice._id, choice => html`
            <paper-radio-button name="${choice._id}">
              ${choice.name}
            </paper-radio-button>
          `)}
        </paper-radio-group>
      `: ''}
    `;
  }

  static get properties () {
    return {
      event: { type: Object }
    };
  }
}

window.customElements.define('event-card', EventCard);