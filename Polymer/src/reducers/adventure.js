import {
  INIT_ADVENTURE
} from '../actions/adventure';

const initialState = {
  started: false,
  questions: [],
  accessCode: '',
  userMode: '',
  teamName: ''
}

const adventure = (state = initialState, action) => {
  switch(action.type) {
    case INIT_ADVENTURE:
      return {
        ...state,
        questions: action.questions,
        accessCode: action.accessCode,
        userMode: action.userMode,
        teamName: action.teamName
      }
    default:
      return state;
  }
};

export default adventure;