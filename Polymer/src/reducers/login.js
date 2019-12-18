import {
  SET_ACCESS_CODE_ERROR,
  CHECK_ACCESS_CODE_SUCCESS,
  UPDATE_LOGIN_STEP,
  SET_EMAIL_ERROR
} from '../actions/login';

const initialState = {
  accessCodeError: '',
  emailError: '',
  step: 'start-screen'
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
    case CHECK_ACCESS_CODE_SUCCESS:
      return {
        ...state
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