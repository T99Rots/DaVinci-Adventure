import { html, css } from 'lit-element';
import { PageViewElement } from '../components/page-view-element';
import { repeat } from 'lit-html/directives/repeat';
import { connect } from 'pwa-helpers/connect-mixin';

import '@polymer/paper-tabs';
import '@polymer/iron-icon';
import '@polymer/iron-icons';
import '@polymer/iron-icons/social-icons';
import '@polymer/iron-icons/maps-icons';
import '@polymer/paper-fab';
import '@polymer/paper-menu-button';
import '@polymer/paper-listbox';
import '@polymer/paper-item';
import '@polymer/paper-icon-button';
import '@polymer/paper-item/paper-item-body';

import '../components/bottom-sheet-page';
import '../components/transforming-header';
import '../components/page-slider';
import '../components/event-card';
import '../components/map-tiler';

import { mapsIcon } from '../components/icons';
import SharedStyles, { shadows } from '../components/shared-styles';

import { updateDrawer } from '../actions/app';
import { updateTab, loadAdventure, answerQuestion } from '../actions/adventure';

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

        .card {
          width: calc(100vw - 50px);
          margin: 15px 10px;
          padding: 10px 15px;
          position: fixed;
          bottom: 0;
        }
        
        #fake-maps, map-tiler {
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
          color: #555;
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

        #focus-map-button {
          position: fixed;
          bottom: 64px;
          right: 16px;
        }

        #map-type-menu {
          position: fixed;
          top: 72px;
          right: 16px;
        }

        #map-type-menu p {
          margin: 0;      
          font-size: 12px;
          color: #555;  
        }

        #map-type-menu > div > p {
          padding: 6px 10px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
        }

        #map-type-menu .container {
          display: flex;
          padding: 0 7px;
        }

        #map-type-menu .container > div {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 3px;
        }

        #map-type-menu .container > div[selected] > .map-preview {
          width: 44px;
          height: 44px;
          border: 2px solid var(--app-primary-color);
        }

        #map-type-menu .container p {
          padding: 8px 0 10px;
        }

        #map-type-menu .map-preview {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          background-size: cover;
          background-position: center;
        }
        paper-item p {
          flex-grow: 1;
          padding-left: 20px;
        }
        div[slide] > p {
          margin: 10px 20px 10px;
        }
        div[slide] > h3 {
          margin: 40px 20px 10px;
          font-size: 18px;
          color: #555;
        }
        div[slide] b {
          color: #555;
        }
        div[slide] {
          overflow: auto;
          max-height: calc(100vh - 110px);
        }
        [slide="questions"] event-card:last-child {
          padding-bottom: 60px;
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
      <map-tiler .events="${this._events}" .area="${this._area}"></map-tiler>
      <paper-fab id="focus-map-button" icon="maps:my-location"></paper-fab>
      <div id="bottom">
        <bottom-sheet-page ?opened="${['info', 'questions'].includes(this._selectedTab)}">
          <page-slider selected="${this._selectedTab}">
            <div slide="info">
              <h3>introduction</h3>

              <p>${this._introduction}</p>

              <p><b>Team:</b> ${this._teamName}</p>

              <p>${this._userMode === 'adventure-team-leader'? html`
                Toegangscode: ${this._accessCode} 
              `: ''}
              </p>

              <h3>Team spelers</h3>

              <paper-listbox>                
                <paper-item>
                  <p>Player 1</p>
                  <paper-icon-button icon="more-vert"></paper-icon-button>
                </paper-item>
                <paper-item>
                  <p>Player 2</p>
                  <paper-icon-button icon="more-vert"></paper-icon-button>
                </paper-item>
                <paper-item>
                  <p>Player 3</p>
                  <paper-icon-button icon="more-vert"></paper-icon-button>
                </paper-item>
                <paper-item>
                  <p>Player 4</p>
                  <paper-icon-button icon="more-vert"></paper-icon-button>
                </paper-item>
              </paper-listbox>
            </div>
            <div slide="questions" index="1">
              ${repeat(this._events.filter(event => event.visibility === 'visible'), e => e._id, event => html`
                <event-card 
                  .event="${event}"
                  @question-answered="${(e) => store.dispatch(answerQuestion(event._id, e.detail))}">
                </event-card>
              `)}
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

  firstUpdated() {
    const map = this.renderRoot.querySelector('map-tiler');
    this.renderRoot.getElementById('focus-map-button').addEventListener('click', () => {
      map.focusOnUserLocation();
    });
    store.dispatch(loadAdventure());
    import('../upload-queue');
  }

  static get properties() {
    return {
      _selectedTab: { type: String },
      _mapType: { type: String },
      _accessCode: { type: String },
      _teamLeader: { type: Boolean },
      _teamName: { type: String },
      _adventureName: { type: String },
      _introduction: { type: String },
      _events: { type: Array },
      _stared: { type: Boolean },
      _area: { type: Array }
    }
  }

  stateChanged(state) {
    this._selectedTab = state.adventure.selectedTab;
    this._mapType = state.adventure.mapType;
    this._accessCode = state.adventure.accessCode;
    this._teamLeader = state.adventure.teamLeader;
    this._teamName = state.adventure.teamName;
    this._adventureName = state.adventure.adventureName;
    this._introduction = state.adventure.introduction;
    this._events = state.adventure.events;
    this._started = state.adventure.started;
    this._area = state.adventure.area;
  }
}

window.customElements.define('adventure-page', AdventurePage);