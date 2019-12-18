import { html, css } from 'lit-element';
import { PageViewElement } from '../components/page-view-element';
import { connect } from 'pwa-helpers/connect-mixin';

import SharedStyles from '../components/shared-styles';

import '@polymer/paper-input/paper-input';
import '@polymer/iron-icons'
import '@polymer/paper-button';
import '@polymer/paper-icon-button/paper-icon-button';
import '../components/paper-pincode';

import { store } from '../store';

import login from '../reducers/login';

store.addReducers({
  login
});

import {
  loginWithAccessCode,
  resetAccessCodeError,
  updateLoginStep,
  loginWithEmail,
  resetEmailError
} from '../actions/login';

class LoginPage extends connect(store)(PageViewElement) {
	static get styles() {
		return [
      SharedStyles,
      css`
        :host {
          display: flex;
          align-items: center;
          flex-direction: column;
        }

        .step {
          display: flex;
          align-items: center;
          flex-direction: column;
          width: 100%;
        }

        h1 {
          margin: 90px 0;
          font-weight: 100;
        }

        #access-code {
          width: 230px;
          border: none;
          background: #eee;
          height: 40px;
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
          text-align: center;
          font-size: 28px;
          letter-spacing: 8px;
          padding-left: 15px;
          border-bottom: 1px solid #aaa;
          font-family: Roboto;
          color: #333;
        }

        #access-code:focus {
          outline: none;
        }

        #access-code::placeholder {
          letter-spacing: normal;
          color: #ccc;
          font-family: Roboto;
          font-weight: 100;
          font-size: 20px;
          line-height: 43px;
        }

        #access-code-container {
          position: relative;
          overflow: hidden;
        }

        #access-code-container::after {
          position: absolute;
          height: 2px;
          background: linear-gradient(193deg, #98cb95, #328f7f);
          left: 0;
          right: 0;
          bottom: 0;
          content: '';
          transform: scaleX(0.0001);
          transition: 0.225s transform;
        }
        
        #access-code-container:focus-within::after {
          transform: scaleX(1);
        }

        .error {
          color: #ff5a5a;
          font-weight: 500;
          width: calc(100% - 60px);
          text-align: center;
        }

        #back-button {
          position: fixed;
          top: 10px;
          left: 10px;
          color: #777;
          transition: opacity 0.3s ease-out;
        }

        #back-button[disabled] {
          opacity: 0;
        }

        .step.start-screen p {
          color: #333;
        }

        .step.email paper-input {
          width: calc(100% - 60px);
          --paper-input-container-focus-color: var(--app-primary-color);
        }

        #email-login-btn {
          margin-top: 80px;
        }

        .next {
          margin-top: 40px;
        }

        @keyframes loading {
          from {
            background-position: 0 0%;
          };
          to {
            background-position: 0 -100%;
          };
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
        @click="${() => store.dispatch(updateLoginStep('start-screen'))}">
      </paper-icon-button>
      <h1>
        Adventure App
      </h1>
      <div class="step start-screen" ?hidden="${this._step !== 'start-screen'}">
        <p>Log in via</p>
        <paper-button class="primary-btn" @click="${() => store.dispatch(updateLoginStep('code-login'))}">
          Toegangscode
        </paper-button>
        <p>of</p>
        <paper-button class="secondary-btn" @click="${() => store.dispatch(updateLoginStep('email-login'))}">
          Email
        </paper-button>
      </div>
      <div class="step" ?hidden="${this._step !== 'code-login'}">
        <div id="access-code-container">
          <input
            placeholder="Toegangscode"
            name="access-code"
            type="text"
            pattern="\d*"
            maxlength="6"
            id="access-code"
            spellcheck="none"
            inputmode="numeric"
            @input="${(e) => this._onCodeInput(e)}">
        </div>
        <p class="error">${this._codeError}</p>
        <paper-button 
          class="fancy-btn next"
          ?disabled="${!this._codeValid}"
          @click="${() => this._loginWithCode()}">
          Verzenden
        </paper-button>
      </div>
      <div class="step email" ?hidden="${this._step !== 'email-login'}">
        <paper-input @input="${() => this._onEmailInput()}" label="Email" id="email"></paper-input>
        <paper-input @input="${() => this._onEmailInput()}" label="Wachtwoord" type="password" id="password"></paper-input>
        <p class="error">${this._emailError}</p>
        <paper-button 
          class="fancy-btn"
          id="email-login-btn"
          ?disabled="${!this._emailValid}"
          @click="${() => this._loginWithEmail()}">Login</paper-button>
      </div>
		`
  }

  _onEmailInput() {
    store.dispatch(resetEmailError());
    const email = this.renderRoot.getElementById('email');
    const password = this.renderRoot.getElementById('password');

    if(this._emailRegex.test(email.value) && password.value.length > 0) {
      this._emailValid = true;
    } else {
      this._emailValid = false;
    }
  }

  _onCodeInput(e) {
    store.dispatch(resetAccessCodeError());
    this._codeValid = /^\d{6,6}$/.test(e.path[0].value);
  }

  _loginWithCode() {
    const accessCode = this.renderRoot.getElementById('access-code');
    store.dispatch(loginWithAccessCode(accessCode.value));
  }

  _loginWithEmail() {
    const email = this.renderRoot.getElementById('email');
    const password = this.renderRoot.getElementById('password');
    store.dispatch(loginWithEmail(email.value, password.value));
  }

  static get properties () {
    return {
      _codeError: { type: String },
      _codeValid: { type: Boolean },
      _emailValid: { type: Boolean },
      _emailError: { type: String },
      _step: { type: String }
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
    this._step = state.login.step;
  }
}

window.customElements.define('login-page', LoginPage);