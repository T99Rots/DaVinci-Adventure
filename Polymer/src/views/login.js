import { html, css } from 'lit-element';
import { PageViewElement } from '../components/page-view-element';
import { connect } from 'pwa-helpers/connect-mixin';

import SharedStyles from '../components/shared-styles';

import '@material/mwc-textfield';
import '@polymer/iron-icons'
import '@polymer/paper-button';
import '@polymer/paper-icon-button/paper-icon-button';
import '../components/paper-pincode';
import '../components/page-slider';

import { store } from '../store';

import login from '../reducers/login';
import adventure from '../reducers/adventure'

store.addReducers({
  login,
  adventure
});

import {
  checkAccessCode,
  resetAccessCodeError,
  updateLoginStep,
  loginWithEmail,
  resetEmailError,
  loginWithAccessCode
} from '../actions/login';

class LoginPage extends connect(store)(PageViewElement) {
	static get styles() {
		return [
      SharedStyles,
      css`
        :host {
          position: relative;
          display: flex;
          align-items: center;
          flex-direction: column;
        }

        page-slider > [slide] {
          display: flex;
          align-items: center;
          flex-direction: column;
          width: 100%;
          padding-bottom: 80px;
        }

        h1 {
          margin: 26px 0;
          font-weight: 100;
        }

        .error {
          color: #db3535;
          font-weight: 500;
          width: calc(100% - 60px);
          text-align: center;
        }

        #back-button {
          position: absolute;
          top: 10px;
          left: 10px;
          color: #777;
          transition: opacity 0.3s ease-out;
        }

        #back-button[disabled] {
          opacity: 0;
        }

        [slide=start-screen] p {
          color: #333;
        }

        [slide=team] p b {
          color: var(--app-primary-color);
        }

        [slide=team] p {
          width: calc(100% - 60px);
          text-align: center;
        }

        mwc-textfield {
          padding-top: 20px;
          width: calc(100% - 60px);
          --mdc-theme-primary: var(--app-primary-color);
          --mdc-theme-error: #db3535;
        }

        paper-pincode {
          --paper-pincode-active-color: var(--app-primary-color);
          --paper-pincode-error-color: #db3535;
        }

        .login-btn {
          margin-top: 80px;
        }

        .next {
          margin-top: 40px;
        }
			`
		]
	}

	render() {
    return html`
      <paper-icon-button
        id="back-button"
        ?disabled="${this._step === 'start-screen'}"
        icon="arrow-back"
        @click="${() => this._back()}">
      </paper-icon-button>
      <h1>
        Adventure App
      </h1>
      <page-slider selected="${this._step}">
        <div slide="start-screen" index="0">
          <p>Log in via</p>
          <paper-button class="primary-btn" @click="${() => store.dispatch(updateLoginStep('code-login'))}">
            Toegangscode
          </paper-button>
          <p>of</p>
          <paper-button class="secondary-btn" @click="${() => store.dispatch(updateLoginStep('email-login'))}">
            Email
          </paper-button>
        </div>
        <div slide="code-login" index="1">
          <paper-pincode 
            id="access-code"
            label="Toegangscode"
            @value-changed="${e => this._onCodeInput(e)}"
            @keyup="${e => this._keyUp(e, 'code')}">
          </paper-pincode>
          <p class="error">${this._codeError}</p>
          <paper-button 
            class="fancy-btn next"
            ?disabled="${!this._codeValid}"
            @click="${() => this._checkAccessCode()}">
            Verzenden
          </paper-button>
        </div>
        <div slide="email-login" index="1">
          <mwc-textfield
            outlined
            @input="${() => this._onEmailInput()}"
            label="Email"
            name="email"
            id="email">
          </mwc-textfield>
          <mwc-textfield
            outlined
            @input="${() => this._onEmailInput()}"
            label="Wachtwoord"
            type="password"
            id="password"
            @keyup="${e => this._keyUp(e, 'email')}">
          </mwc-textfield>
          <p class="error">${this._emailError}</p>
          <paper-button 
            class="fancy-btn login-btn"
            ?disabled="${!this._emailValid}"
            @click="${() => this._loginWithEmail()}">Login</paper-button>
        </div>
        <div slide="team" index="2">
          <p>${this._creatingTeam? 
            html`Creëer een team en speel het adventure: <b>${this._adventureName}</b>`: 
            html`Word lid van team <b>${this._teamName}</b> en speel het adventure: <b>${this._adventureName}</b>`}
          </p>
          <mwc-textfield 
            ?hidden="${!this._creatingTeam}"
            outlined
            @input="${() => this._onTeamInput()}"
            label="Team naam"
            id="team-name">
          </mwc-textfield>
          <mwc-textfield
            outlined
            @input="${() => this._onTeamInput()}"
            label="Jouw naam"
            id="player-name"
            @keyup="${e => this._keyUp(e, 'team')}">
          </mwc-textfield>
          <p class="error">${this._teamError}</p>
          <paper-button 
            class="fancy-btn login-btn"
            @click="${() => this._loginWithAccessCode()}"
            ?disabled="${!this._teamValid}">Start!</paper-button>
        </div>
      </page-slider>
		`
  }

  _onTeamInput() {
    const teamName = this.renderRoot.getElementById('team-name');
    const playerName = this.renderRoot.getElementById('player-name');
    
    this._teamValid = (!this._creatingTeam || teamName.value.length > 0 ) && playerName.value.length > 0;
  }

  _onEmailInput() {
    store.dispatch(resetEmailError());
    const email = this.renderRoot.getElementById('email');
    const password = this.renderRoot.getElementById('password');

    this._emailValid = this._emailRegex.test(email.value) && password.value.length > 0;
  }

  _onCodeInput(e) {
    store.dispatch(resetAccessCodeError());
    this._codeValid = e.detail.isValid;
  }

  _keyUp(e, type) {
    if(e.key === 'Enter') {
      switch(type) {
        case 'code':
          if(this._codeValid) this._checkAccessCode();
          return;
        case 'email':
          if(this._emailValid) this._loginWithEmail();
          return;
        case 'team':
          if(this._teamValid) this._loginWithAccessCode();
          return;
      }
    };
  }

  _checkAccessCode() {
    const accessCode = this.renderRoot.getElementById('access-code');
    accessCode.blur();

    store.dispatch(checkAccessCode(accessCode.value));
  }

  _loginWithAccessCode() {
    const teamName = this.renderRoot.getElementById('team-name');
    const playerName = this.renderRoot.getElementById('player-name');
    playerName.blur();
    teamName.blur();

    store.dispatch(loginWithAccessCode(playerName.value, teamName.value));
  }

  _loginWithEmail() {
    const email = this.renderRoot.getElementById('email');
    const password = this.renderRoot.getElementById('password');

    email.blur();
    password.blur();

    store.dispatch(loginWithEmail(email.value, password.value));
  }

  _back() {
    store.dispatch(updateLoginStep(this._step === 'team'? 'code-login': 'start-screen'));
  }

  static get properties () {
    return {
      _codeError: { type: String },
      _codeValid: { type: Boolean },
      _emailValid: { type: Boolean },
      _teamValid: { type: Boolean },
      _emailError: { type: String },
      _step: { type: String },
      _teamName: { type: String },
      _creatingTeam: { type: Boolean },
      _adventureName: { type: String },
      _teamError: { type: String }
    }
  }

  constructor() {
    super();
    this._codeValid = false;
    this._emailRegex = new RegExp([
      '(?:[a-z0-9!#$%&\'*+\/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+\/=?^_`{|}~-]+)*|\"(?:[\\x01-\\x08',
      '\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])',
      '*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:2',
      '5[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-',
      '9-]*[a-z0-9]:(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\\\[\\x01-\\x09',
      '\\x0b\\x0c\\x0e-\\x7f])+)\\])'
    ].join(''));
  }

  stateChanged(state) {
    this._codeError = state.login.accessCodeError;
    this._emailError = state.login.emailError;
    this._teamError = state.login.teamError;
    this._step = state.login.step;
    this._creatingTeam = state.login.creatingTeam;
    this._teamName = state.login.teamName;
    this._adventureName = state.login.adventureName;
  }
}

window.customElements.define('login-page', LoginPage);