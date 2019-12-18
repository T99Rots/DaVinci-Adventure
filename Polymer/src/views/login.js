import { html, css } from 'lit-element';
import { PageViewElement } from '../components/page-view-element';

import '@polymer/paper-button';
import '@polymer/iron-icons/iron-icons.js';
import SharedStyles from '../components/shared-styles';

class LoginPage extends PageViewElement {
	static get styles() {
		return [
      SharedStyles,
			css`
			`
		]
	}

	render() {
    return html`
		`
	}
}

window.customElements.define('login-page', LoginPage);