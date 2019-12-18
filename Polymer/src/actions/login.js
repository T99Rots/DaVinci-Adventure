export const CHECK_ACCESS_CODE_SUCCESS = 'CHECK_ACCESS_CODE_SUCCESS';
export const SET_ACCESS_CODE_ERROR = 'SET_ACCESS_CODE_ERROR';
export const UPDATE_LOGIN_STEP = 'UPDATE_LOGIN_STEP';
export const SET_EMAIL_ERROR = 'SET_EMAIL_ERROR';

import { updateLoading } from './app';

const emailRegex = new RegExp([
  '(?:[a-z0-9!#$%&\'*+\/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+\/=?^_`{|}~-]+)*|\"(?:[\\x01-\\x08',
  '\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])',
  '*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:2',
  '5[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-',
  '9-]*[a-z0-9]:(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\\\[\\x01-\\x09',
  '\\x0b\\x0c\\x0e-\\x7f])+)\\])'
].join(''));

export const loginWithAccessCode = (accessCode) => async (dispatch, getState) => {
  if(getState().app.appLoading) return;
  if(/^\d{6,6}$/.test(accessCode)) {
    try {
      dispatch(updateLoading(true));
      const res = await fetch('http://localhost:9001/login/access-code', {
        method: 'POST',
        body: JSON.stringify({
          accessCode
        })
      });
      dispatch(updateLoading(false));
  
      if(res.status === 200) {
        dispatch({
          type: CHECK_ACCESS_CODE_SUCCESS
        });
      } else if(res.status === 400) {
        dispatch(setAccessCodeError((await res.json()).error));
      } else {
        dispatch(setAccessCodeError('Er is een fout opgetreden tijdens het checken van de toegangscode'));
      }
    } catch(e) {
      dispatch(updateLoading(false));
      dispatch(setAccessCodeError('Er is een fout opgetreden tijdens het checken van de toegangscode'));
    }
  } else {
    const hasNonNumbers = !/^\d*$/.test(accessCode);
    const toLittleChars = accessCode.length < 6;
    if(hasNonNumbers && !toLittleChars) {
      dispatch(setAccessCodeError('Code mag alleen nummers bevatten'));
    } else if (!hasNonNumbers && toLittleChars) {
      dispatch(setAccessCodeError('Code moet minimaal 6 nummers lang zijn'));
    } else {
      dispatch(setAccessCodeError('Code moet minimaal 6 nummers lang zijn en alleen nummers bevatten'));
    }
  }
}

export const loginWithEmail = (email, password) => async (dispatch, getState) => {
  if(getState().app.appLoading) return;

  const emailValid = emailRegex.test(email);
  const passwordValid = password.length > 0;

  if(emailValid && passwordValid) {
    try {
      dispatch(updateLoading(true));
      const res = await fetch('http://localhost:9001/login/email', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password
        })
      });
      dispatch(updateLoading(false));
  
      if(res.status === 200) {
        dispatch({
          type: CHECK_ACCESS_CODE_SUCCESS
        });
      } else if(res.status === 400) {
        dispatch(setEmailError((await res.json()).error));
      } else {
        dispatch(setEmailError('Er is een fout opgetreden tijdens het inloggen'));
      }
    } catch(e) {
      dispatch(updateLoading(false));
      dispatch(setEmailError('Er is een fout opgetreden tijdens het inloggen'));
    }
  } else {
    if(emailValid && !passwordValid) {
      dispatch(setEmailError('Opgegeven wachtwoord is niet valide'));
    } else if (!emailValid && passwordValid) {
      dispatch(setEmailError('Opgegeven email is niet valide'));
    } else {
      dispatch(setEmailError('Opgegeven wachtwoord en email zijn niet valide'));
    }
  }
}

export const resetEmailError = () => (dispatch, getState) => {
  if(getState().login.emailError) {
    dispatch(setEmailError(''));
  }
};

export const resetAccessCodeError = () => (dispatch, getState) => {
  if(getState().login.accessCodeError) {
    dispatch(setAccessCodeError(''));
  }
};

const setAccessCodeError = (error) => ({
  type: SET_ACCESS_CODE_ERROR,
  error
});

const setEmailError = (error) => ({
  type: SET_EMAIL_ERROR,
  error
});

export const updateLoginStep = (step) => ({
  type: UPDATE_LOGIN_STEP,
  step
});