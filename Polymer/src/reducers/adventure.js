import {
  INIT_ADVENTURE,
  UPDATE_ADVENTURE_TAB
} from '../actions/adventure';

const initialState = {
  started: false,
  questions: [],
  accessCode: '',
  userMode: '',
  teamName: '',
  selectedTab: 'info'
}

const adventure = (state = initialState, action) => {
  switch(action.type) {
    case INIT_ADVENTURE:
      return {
        ...state,
        questions: action.questions,
        accessCode: action.accessCode,
        userMode: action.userMode,
        teamName: action.teamName,
        adventureName: action.adventureName
      }
    case UPDATE_ADVENTURE_TAB:
      return {
        ...state,
        selectedTab: action.tabName
      }
    default:
      return state;
  }
};

export default adventure;