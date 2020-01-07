import { html, css } from 'lit-element';
import { repeat } from 'lit-html/directives/repeat';
import { PageViewElement } from '../components/page-view-element';
import { connect } from 'pwa-helpers/connect-mixin';

import SharedStyles from '../components/shared-styles';
import '@polymer/paper-fab';
import '@polymer/paper-listbox';
import '@polymer/paper-item';
import '@polymer/paper-item/paper-item-body';
import '@polymer/paper-item/paper-icon-item';
import '@polymer/paper-icon-button';
import '@polymer/iron-icons';
import '@polymer/iron-icons/av-icons';
import '../components/bottom-sheet';

import { store } from '../store';

import templates, { selectedTemplateSelector } from '../reducers/templates';

store.addReducers({
  templates
});

import {
  getTemplates,
  updateSelectedTemplate,
  updateBottomSheet,
  startAdventure
} from '../actions/templates'

class TemplatesPage extends connect(store)(PageViewElement) {
	static get styles() {
		return [
      SharedStyles,
      css`
        :host {
          display: block;
        }

        paper-fab {
          position: fixed;
          right: 16px;
          bottom: 16px;
          box-shadow: 
            0 12px 16px 1px rgba(0, 0, 0, 0.14),
            0 4px 22px 3px rgba(0, 0, 0, 0.12),
            0 6px 7px -4px rgba(0, 0, 0, 0.4);
          transition: box-shadow 0.28s cubic-bezier(0.4, 0, 0.2, 1);
          --paper-fab-background: linear-gradient(193deg, #98cb95, #328f7f);
          --paper-fab-keyboard-focus-background: linear-gradient(193deg, #98cb95, #328f7f);
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

        .message {
          padding: 150px 30px 0;
          text-align: center;
        }

        .message p {
          color: rgba(0, 0, 0, 0.6);
        }

        #arrow {
          position: fixed;
          right: 92px;
          opacity: 0.4;
          bottom: 25px;
          width: 115px;
        }

        bottom-sheet iron-icon {
          color: rgba(0, 0, 0, 0.6);
        }

        bottom-sheet hr {
          border-color: rgba(0,0,0,0.1);
          border-width: 1px;
          border-bottom: none;
          margin: 0;
        }

        bottom-sheet h3 {
          margin: 0;
          line-height: 48px;
          padding: 0 20px;
          font-weight: 500;
          font-size: 16px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #888;
        }

        paper-listbox {
          padding-top: 0;
        }
			`
		]
	}

	render() {
    return html`
      <div 
        class="message"
        ?hidden="${!this._initialized || this._error || this._templates.length > 0}">
        <h2>Geen templates</h2>
        <p>
          Er zijn nog geen Adventure templates, klik op de + knop om een template aan te maken
        </p>
        <img src="/images/curving-arrow.png" id="arrow">
      </div>
      <div class="message" ?hidden="${!this._error}">
        <h2>Error!</h2>
        <p>${this._error}</p>
      </div>
      <paper-listbox>
        ${repeat(this._templates, t => t._id, template => html`
          <paper-item>
            <paper-item-body two-line>
              <div>${template.name}</div>
              <div secondary>
                Gemaakt door ${template.userCreated}
                op ${template.dateCreated.toLocaleString('nl', {
                  weekday: 'long',
                  year: 'numeric',
                  day: 'numeric',
                  month: 'short'
                })}
              </div>
            </paper-item-body>
            <paper-icon-button 
              icon="more-vert"
              @click="${() => store.dispatch(updateSelectedTemplate(template._id))}">
            </paper-icon-button>
          </paper-item>
        `)}
      </paper-listbox>
      <paper-fab
        icon="add"
        elevation="5"
        ?disabled="${!this._initialized || this._error}">
      </paper-fab>
      <bottom-sheet 
        ?opened="${this._bottomSheetOpened}"
        @close="${() => store.dispatch(updateBottomSheet(false))}">
        <h3>${this._selectedTemplate && this._selectedTemplate.name}</h3>
        <hr>
        <paper-listbox>
          <paper-icon-item @click="${() => store.dispatch(startAdventure(this._selectedTemplate._id))}">
            <iron-icon icon="av:play-arrow" slot="item-icon"></iron-icon>  
            Start adventure
          </paper-icon-item>
          <paper-icon-item>
            <iron-icon icon="delete" slot="item-icon"></iron-icon>  
            Verwijder template
          </paper-icon-item>
        </paper-listbox>
      </bottom-sheet>
		`
  }
  
  firstUpdated() {
    store.dispatch(getTemplates());
  }

  static get properties() {
    return {
      _initialized: { type: Boolean },
      _templates: { type: Array },
      _error: { type: String },
      _selectedTemplate: { type: Object },
      _bottomSheetOpened: { type: Boolean }
    }
  }

  stateChanged(state) {
    this._selectedTemplate = selectedTemplateSelector(state);
    this._templates = state.templates.templates;
    this._error = state.templates.templatesError;
    this._initialized = state.templates.initialized;
    this._bottomSheetOpened = state.templates.bottomSheetOpened;
  }
}

window.customElements.define('templates-page', TemplatesPage);