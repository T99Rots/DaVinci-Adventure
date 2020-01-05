import {
  SET_ACCESS_CODE_ERROR,
  SET_EMAIL_ERROR,
  SET_TEAM_ERROR,
  CHECK_ACCESS_CODE_SUCCESS,
  UPDATE_LOGIN_STEP
} from '../actions/login';

const initialState = {
  accessCodeError: '',
  emailError: '',
  teamError: '',
  step: 'code-login',
  teamName: 'No team name found',
  creatingTeam: false,
  adventureName: 'No adventure name found',
  accessCode: null
}

const login = (state = initialState, action) => {
  switch(action.type) {
    case SET_ACCESS_CODE_ERROR:
      return {
        ...state,
        accessCodeError: action.error
      };
    case SET_EMAIL_ERROR:
      return {
        ...state,
        emailError: action.error
      }
    case SET_TEAM_ERROR:
      return {
        ...state,
        teamError: action.error
      }
    case CHECK_ACCESS_CODE_SUCCESS:
      return {
        ...state,
        step: 'team',
        adventureName: action.adventureName,
        teamName: action.teamName,
        creatingTeam: action.creatingTeam,
        accessCode: action.accessCode
      }
    case UPDATE_LOGIN_STEP:
      return {
        ...state,
        step: action.step
      }
    default:
      return state;
  }
};

export default login;