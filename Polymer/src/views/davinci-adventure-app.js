import { html, css, LitElement } from 'lit-element';
import { connect } from 'pwa-helpers/connect-mixin';
import { updateMetadata } from 'pwa-helpers/metadata';
import { router } from '../routes';
import { store } from '../store';

import {
  activePageSelector
} from '../reducers/app';

//importing the actions required by this app
import {
  navigate,
  updatePages
} from '../actions/app';

//importing components used by this page
import '../components/view-container';

import sharedStyles from '../components/shared-styles';

//the main custom element
class AdventureApp extends connect(store)(LitElement) {

	static get styles () {
		return [
      sharedStyles,
      css`
        
      `
    ]
	}

	render() {
		return html`
      <view-container page="${this._page.tagName? this._page.tagName: ''}"></view-container>
		`
	}

	firstUpdated() {
		router.addEventListener('page-change', e => {
      store.dispatch(navigate(e.page));
    });
    store.dispatch(updatePages(router.resolveAll()));
    store.dispatch(navigate(router.activePage));
	}

	updated(changedProps) {
		if(changedProps.has('_title')) {
			updateMetadata({
				title: `Adventure App ${this._title?' - ' + this._title: ''}`,
				description: this._title
			})
    }
	}

	static get properties () {
		return {
			_page: Object,
      _title: String
    }
	}

	stateChanged(state) {
    this._page = activePageSelector(state);
    this._title = this._page.title;
  }
}

customElements.define('adventure-app', AdventureApp);