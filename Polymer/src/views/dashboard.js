import { html, css } from 'lit-element';
import { PageViewElement } from '../components/page-view-element';

import SharedStyles from '../components/shared-styles';

class Page404 extends PageViewElement {
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

window.customElements.define('dashboard-page', Page404);