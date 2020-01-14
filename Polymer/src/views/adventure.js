import { html, css } from 'lit-element';
import { PageViewElement } from '../components/page-view-element';
import { connect } from 'pwa-helpers/connect-mixin';

import '@danielturner/google-map';
import '@polymer/paper-tabs';
import '@polymer/iron-icon';
import '@polymer/iron-icons';
import '@polymer/iron-icons/social-icons';
import '@polymer/iron-icons/maps-icons';
import '@polymer/paper-fab';
import '../components/bottom-sheet-page';
import '../components/transforming-header';
import '../components/page-slider';

import { mapsIcon } from '../components/icons';
import SharedStyles, { shadows } from '../components/shared-styles';

import { updateDrawer } from '../actions/app';
import { updateTab } from '../actions/adventure';

import { store } from '../store';

import templates from '../reducers/templates';
import adventure from '../reducers/adventure';

store.addReducers({
  templates,
  adventure
});

class AdventurePage extends connect(store)(PageViewElement) {
	static get styles() {
		return [
      SharedStyles,
      shadows,
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

        google-map {
          /* height: calc(100vh - 64px); */
        }

        .card {
          width: calc(100vw - 50px);
          margin: 15px 10px;
          padding: 10px 15px;
          position: fixed;
          bottom: 0;
        }
        
        #fake-maps, google-map {
          position: fixed;
          top: 0;
          bottom: 0;
          right: 0;
          left: 0;
          /* background: url('/images/fake-maps.png');
          background-size: cover;
          background-position: center; */
        }

        #bottom {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
        }

        paper-tabs {
          background: white;
          --paper-tabs-selection-bar-color: var(--app-primary-color);
          --paper-tab-ink: black;
        }

        paper-tab {
          color: #555;
        }

        paper-tab[aria-selected="true"] {
          color: var(--app-primary-color);
        }

        .tab-content {
          font-size: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .elevation {
          box-shadow:       
            0 3px 4px 0 rgba(0, 0, 0, 0.56),
            0 1px 8px 0 rgba(0, 0, 0, 0.48),
            0 3px 3px -2px rgba(0, 0, 0, 1);
        }
        bottom-sheet-page {
          bottom: 48px;
          --shim-background: white;
          --sheet-box-shadow: none;
          z-index: -1;
        }
        paper-fab {
          position: fixed;
          right: 16px;
          bottom: 64px;
          box-shadow: 
            0 12px 16px 1px rgba(0, 0, 0, 0.14),
            0 4px 22px 3px rgba(0, 0, 0, 0.12),
            0 6px 7px -4px rgba(0, 0, 0, 0.4);
          transition: box-shadow 0.28s cubic-bezier(0.4, 0, 0.2, 1);
          --paper-fab-background: white;
          --paper-fab-keyboard-focus-background: white;
        }

        paper-fab[pressed] {
          box-shadow: 
            0 24px 38px 3px rgba(0, 0, 0, 0.14),
            0 9px 46px 8px rgba(0, 0, 0, 0.12),
            0 11px 15px -7px rgba(0, 0, 0, 0.4);
        }

        paper-fab[disabled] {
          box-shadow: none;
        }
			`
		]
	}

	render() {
    return html`
      <transforming-header ?floating="${!['info', 'questions'].includes(this._selectedTab)}">
        <paper-icon-button icon="menu" @click="${() => store.dispatch(updateDrawer(true))}"></paper-icon-button>
        ${this._adventureName}
        <span style="width: 48px"></span>
      </transforming-header>
      <google-map 
        disable-default-ui
        disable-map-type-control
        disable-street-view-control
        latitude="51.798363"
        longitude="4.679588"
        api-key="AIzaSyDl3wTiUNQMTzfRxxqgEe8bVJFdax52cZs">
      </google-map>
      <paper-fab>
        <iron-icon icon="maps:my-location"></iron-icon>
      </paper-fab>
      <!-- <div id="fake-maps"></div> -->

      <div id="bottom">
        <bottom-sheet-page ?opened="${['info', 'questions'].includes(this._selectedTab)}">
          <page-slider selected="${this._selectedTab}">
            <div slide="info">
              Team ${this._teamName}

              ${this._userMode === 'adventure-team-leader'? html`
                Team toegangscode: ${this._accessCode} 
              `: ''}
            </div>
            <div slide="questions" index="1">
              this is questions
            </div>
          </page-slider>
        </bottom-sheet-page>
        <paper-tabs class="elevation" selected="${['info', 'questions', 'map'].indexOf(this._selectedTab)}">
          <paper-tab @click="${() => store.dispatch(updateTab('info'))}">
            <div class="tab-content">
              <iron-icon icon="info"></iron-icon>
              Info
            </div>
          </paper-tab>
          <paper-tab @click="${() => store.dispatch(updateTab('questions'))}">
            <div class="tab-content">
              <iron-icon icon="icons:assignment"></iron-icon>
              Vragen
            </div>
          </paper-tab>
          <paper-tab @click="${() => store.dispatch(updateTab('map'))}">
            <div class="tab-content">
              ${mapsIcon}
              Kaart
            </div>
          </paper-tab>
        </paper-tabs>
      </div>
    `
  }

  static get properties() {
    return {
      _accessCode: { type: String },
      _teamName: { type: String },
      _adventureName: { type: String },
      _info: { type: String },
      _selectedTab: { type: String },
      _userMode: { type: String }
    }
  }

  stateChanged(state) {
    this._accessCode = state.adventure.accessCode;
    this._userMode = state.adventure.userMode;
    this._selectedTab = state.adventure.selectedTab;
    this._adventureName = state.adventure.adventureName;
    this._teamName = state.adventure.teamName;
  }
}

window.customElements.define('adventure-page', AdventurePage);