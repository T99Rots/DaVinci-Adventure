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
  updatePages,
  updateDrawer
} from '../actions/app';

//importing components used by this page
import '@polymer/paper-progress';
import '../components/view-container';
import '@polymer/app-layout/app-header/app-header';
import '@polymer/app-layout/app-toolbar/app-toolbar';
import '@polymer/app-layout/app-drawer/app-drawer';
import '@polymer/paper-icon-button';
import '@polymer/paper-listbox';
import '@polymer/paper-item';
import '@polymer/iron-icons';
import '@polymer/iron-icon';

import sharedStyles from '../components/shared-styles';

//the main custom element
class AdventureApp extends connect(store)(LitElement) {

	static get styles () {
		return [
      sharedStyles,
      css`
        paper-progress {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          --paper-progress-active-color: var(--app-primary-color);
        }

        app-header {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          text-align: center;
          background-color: var(--app-header-background-color);
          color: var(--app-header-text-color);
          border-bottom: 1px solid #eee;
          z-index: 999;
          background: white;
        }

        app-drawer {
          --app-drawer-width: 280px;
          z-index: 1000;
        }

        @media(min-width: 390px) {
          app-drawer {
            --app-drawer-width: 320px;
          }
        }
      `
    ]
	}

	render() {
    return html`
      <app-header condenses reveals effects="waterfall" ?hidden="${!this._header}">
        <app-toolbar class="toolbar-top">
          <paper-icon-button icon="menu" @click="${() => store.dispatch(updateDrawer(true))}"></paper-icon-button>          
          <div main-title>${this._title}</div>
          <paper-icon-button icon="search"></paper-icon-button>          
        </app-toolbar>
      </app-header>
      <app-drawer 
        ?opened="${this._drawerOpened}"
        @opened-changed="${({detail: {value}}) => store.dispatch(updateDrawer(value))}">
        <paper-listbox>
          <paper-item @click="${() => this._logout()}">Log uit</paper-item>
        </paper-listbox>
      </app-drawer>
      <paper-progress ?hidden="${!this._loading}" indeterminate></paper-progress>
      <view-container page="${this._page.tagName? this._page.tagName: ''}"></view-container>
		`
  }
  
  _logout() {
    localStorage.clear();
    window.location.href = '/';
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
			_page: { type: Object },
      _title: { type: String },
      _loading: { type: Boolean },
      _header: { type: Boolean },
      _drawerOpened: { type: Boolean }
    }
	}

	stateChanged(state) {
    this._page = activePageSelector(state);
    this._title = this._page.title;
    this._loading = state.app.appLoading;
    this._header = this._page.header;
    this._drawerOpened = state.app.drawerOpened;
  }
}

customElements.define('adventure-app', AdventureApp);