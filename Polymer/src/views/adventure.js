import { html, css } from 'lit-element';
import { PageViewElement } from '../components/page-view-element';
import { connect } from 'pwa-helpers/connect-mixin';

import SharedStyles from '../components/shared-styles';

import { store } from '../store';

import templates from '../reducers/templates';

store.addReducers({
  templates
});

class AdventurePage extends connect(store)(PageViewElement) {
	static get styles() {
		return [
      SharedStyles,
      css`
        :host {
          display: block;
        }

        h1 {
          margin: 0;
          padding-top: 20px;
          letter-spacing: 5px;
          text-align: center;
        }

        p {
          margin: 0;
          padding-top: 20px;
          text-align: center;
        }
			`
		]
	}

	render() {
    if(this._userMode === 'adventure-player') return html`
      <p>Joined team ${this._teamName}!</p>
    `
    return html`
      <p>Created team ${this._teamName}!</p>
      <h1>${this._accessCode}</h1>
		`
  }


  static get properties() {
    return {
      _accessCode: { type: String }
    }
  }

  stateChanged(state) {
    this._accessCode = state.adventure.accessCode;
    this._userMode = state.adventure.userMode;
  }
}

window.customElements.define('adventure-page', AdventurePage);