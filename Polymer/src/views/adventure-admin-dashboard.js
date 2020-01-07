import { html, css } from 'lit-element';
import { PageViewElement } from '../components/page-view-element';
import { connect } from 'pwa-helpers/connect-mixin';

import SharedStyles from '../components/shared-styles';

import { store } from '../store';

import templates from '../reducers/templates';

store.addReducers({
  templates
});


class AdventureAdminDashboardPage extends connect(store)(PageViewElement) {
	static get styles() {
		return [
      SharedStyles,
      css`
        :host {
          display: block;
        }

        h1 {
          margin: 0;
          text-align: center;
          padding-top: 80px;
          letter-spacing: 5px;
        }
			`
		]
	}

	render() {
    return html`
      <h1>${this._accessCode}</h1>
		`
  }


  static get properties() {
    return {
      _accessCode: { type: String }
    }
  }

  stateChanged(state) {
    this._accessCode = state.templates.accessCode;
  }
}

window.customElements.define('adventure-admin-dashboard-page', AdventureAdminDashboardPage);