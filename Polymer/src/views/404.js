import { html, css } from 'lit-element';
import { PageViewElement } from '../components/page-view-element';

import '@polymer/paper-button';
import '@polymer/iron-icons/iron-icons.js';
import SharedStyles from '../components/shared-styles';
import { router } from '../routes';

class Page404 extends PageViewElement {
	static get styles() {
		return [
      SharedStyles,
			css`
				:host {
          height: 100vh;
					text-align: center;
          justify-content: center;
					display: flex;
          align-items: center;
          flex-direction: column;
          color: black;
        }
				h1 {
					font-size: 26px;
					margin: 0;
          padding: 50px 0;
          font-weight: normal;
        }
        router-link {
          text-decoration: none;
          color: black;
        }
        iron-icon {
          width: 60px;
          height: 60px;
          fill: black;
        }
			`
		]
	}

	render() {
    return html`
      <iron-icon icon="error"></iron-icon>
			<h1>Sorry, this page does not exist</h1>
      <paper-button class="fancy-btn" @click="${() => router.navigate('/')}">
        Go to the home page
      </paper-button>
		`
	}
}

window.customElements.define('page-404', Page404);