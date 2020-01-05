import { router } from '../routes';

export const CHECK_ACCESS_CODE_SUCCESS = 'CHECK_ACCESS_CODE_SUCCESS';
export const CHECK_EMAIL_SUCCESS = 'CHECK_EMAIL_SUCCESS';
export const SET_ACCESS_CODE_ERROR = 'SET_ACCESS_CODE_ERROR';
export const UPDATE_LOGIN_STEP = 'UPDATE_LOGIN_STEP';
export const SET_EMAIL_ERROR = 'SET_EMAIL_ERROR';
export const SET_TEAM_ERROR = 'SET_TEAM_ERROR';

const errors = {
  LOGIN_FAILED: 'Er is een fout opgetreden tijdens het inloggen',
  ACCESS_CODE_CHECK_FAILED: 'Er is een fout opgetreden tijdens het checken van de toegangscode',
  ACCESS_CODE_ONLY_NUMBER: 'Code mag alleen nummers bevatten',
  ACCESS_CODE_TO_SHORT: 'Code moet minimaal 6 nummers lang zijn',
  ACCESS_CODE_TO_SHOT_AND_ONLY_NUMBERS: 'Code moet minimaal 6 nummers lang zijn en alleen nummers bevatten',
  PASSWORD_INVALID: 'Opgegeven wachtwoord is niet valide',
  EMAIL_INVALID: 'Opgegeven email is niet valide',
  EMAIL_AND_PASSWORD_INVALID: 'Opgegeven wachtwoord en email zijn niet valide',
  NAME_REQUIRED: 'Naam is verplicht',
  TEAM_NAME_REQUIRED: 'Team naam is verplicht',
  TEAM_AND_NAME_REQUIRED: 'Naam en team naam zijn verplicht'
}

import { updateLoading } from './app';

const emailRegex = new RegExp([
  '(?:[a-z0-9!#$%&\'*+\/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+\/=?^_`{|}~-]+)*|\"(?:[\\x01-\\x08',
  '\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])',
  '*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:2',
  '5[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-',
  '9-]*[a-z0-9]:(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\\\[\\x01-\\x09',
  '\\x0b\\x0c\\x0e-\\x7f])+)\\])'
].join(''));

const api = location.protocol + '//' + location.hostname + ':9001';

export const loginWithAccessCode = (name, teamName) => async (dispatch, getState) => {
  const state = getState();
  
  if(state.app.appLoading) return;
  
  if(name.length > 0 && (!state.login.creatingTeam || teamName.length > 0)) {
    try {
      dispatch(updateLoading(true));
      const body = {
        accessCode: state.login.accessCode,
        name
      }
      if(state.login.creatingTeam) body.teamName = teamName;
      const res = await fetch(api + '/login/access-code', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      dispatch(updateLoading(false));
  
      if(res.status > 199 && res.status < 300) {
        const { token, userId, loginType, permissions } = await res.json();
        Object.assign(localStorage, {
          token,
          userId,
          loginType,
          permissions: JSON.stringify(permissions),
          loggedIn: true
        });
        router.navigateId('dashboard');
      } else if(res.status === 400) {
        dispatch(setTeamError((await res.json()).message));
      } else {
        dispatch(setTeamError(errors.LOGIN_FAILED));
      }
    } catch(e) {
      console.error(e);
      dispatch(updateLoading(false));
      dispatch(setTeamError(errors.LOGIN_FAILED));
    }
  } else {
    const nameValid = name.length > 0;
    const teamValid = (!state.login.creatingTeam || teamName.length > 0);
    if(!nameValid && teamValid) {
      dispatch(setTeamError(errors.NAME_REQUIRED));
    } else if (nameValid && !teamValid) {
      dispatch(setTeamError(errors.TEAM_NAME_REQUIRED));
    } else {
      dispatch(setTeamError(errors.TEAM_AND_NAME_REQUIRED));
    }
  }
}

export const checkAccessCode = (accessCode) => async (dispatch, getState) => {
  if(getState().app.appLoading) return;
  if(/^\d{6,6}$/.test(accessCode)) {
    try {
      dispatch(updateLoading(true));
      const res = await fetch(api + '/login/check-access-code', {
        method: 'POST',
        body: JSON.stringify({
          accessCode: +accessCode
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      dispatch(updateLoading(false));
  
      if(res.status === 200) {
        const resBody = await res.json()

        dispatch({
          type: CHECK_ACCESS_CODE_SUCCESS,
          creatingTeam: resBody.type === 'create-team',
          teamName: resBody.teamName,
          adventureName: resBody.adventureName,
          accessCode: +accessCode
        });
      } else if(res.status === 400) {
        dispatch(setAccessCodeError((await res.json()).message));
      } else {
        dispatch(setAccessCodeError(errors.ACCESS_CODE_CHECK_FAILED));
      }
    } catch(e) {
      console.error(e);
      dispatch(updateLoading(false));
      dispatch(setAccessCodeError(errors.ACCESS_CODE_CHECK_FAILED));
    }
  } else {
    const hasNonNumbers = !/^\d*$/.test(accessCode);
    const toLittleChars = accessCode.length < 6;
    if(hasNonNumbers && !toLittleChars) {
      dispatch(setAccessCodeError(errors.ACCESS_CODE_ONLY_NUMBER));
    } else if (!hasNonNumbers && toLittleChars) {
      dispatch(setAccessCodeError(errors.ACCESS_CODE_TO_SHORT));
    } else {
      dispatch(setAccessCodeError(errors.ACCESS_CODE_TO_SHOT_AND_ONLY_NUMBERS));
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
      const res = await fetch(api + '/login/email', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      dispatch(updateLoading(false));
  
      if(res.status === 200) {
        const { token, userId, loginType, permissions } = await res.json();
        Object.assign(localStorage, { 
          token,
          userId,
          loginType,
          permissions: JSON.stringify(permissions),
          loggedIn: true
        });
        router.navigateId('dashboard');
      } else if(res.status === 400) {
        dispatch(setEmailError((await res.json()).message));
      } else {
        dispatch(setEmailError(errors.LOGIN_FAILED));
      }
    } catch(e) {
      console.error(e);
      dispatch(updateLoading(false));
      dispatch(setEmailError(errors.LOGIN_FAILED));
    }
  } else {
    if(emailValid && !passwordValid) {
      dispatch(setEmailError(errors.PASSWORD_INVALID));
    } else if (!emailValid && passwordValid) {
      dispatch(setEmailError(errors.EMAIL_INVALID));
    } else {
      dispatch(setEmailError(errors.EMAIL_AND_PASSWORD_INVALID));
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

const setTeamError = (error) => ({
  type: SET_TEAM_ERROR,
  error
});

export const updateLoginStep = (step) => ({
  type: UPDATE_LOGIN_STEP,
  step
});