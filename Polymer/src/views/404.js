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
				paper-button {
          position: relative;
          padding: 12px 44px;
          font-size: 14px;
          background: linear-gradient(193deg, rgb(0, 50, 255), rgb(0, 180, 255));
          color: white;
          border-radius: 21px;
          transform-style: preserve-3d;
          font-weight: 600;
          font-size: 16px;
        }
        paper-button::before {
          opacity: 0;
          background: linear-gradient(193deg, rgb(0, 50, 255), rgb(0, 180, 255));
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
        paper-button:hover::before {
          opacity: 1;
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
      <paper-button @click="${() => router.navigate('/')}">
        Go to the home page
      </paper-button>
		`
	}
}

window.customElements.define('page-404', Page404);