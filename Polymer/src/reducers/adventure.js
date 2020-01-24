import {
  UPDATE_ADVENTURE_TAB,
  UPDATE_MAP_TYPE,
  LOAD_ADVENTURE,
  LOAD_ADVENTURE_FAILED,
  ANSWER_QUESTION,
  SET_EVENT_VISIBILITY
} from '../actions/adventure';

const initialState = {
  selectedTab: 'info',
  mapType: 'roadmap',
  started: false,
  accessCode: '',
  teamLeader: false,
  teamName: '',
  adventureName: '',
  introduction: '',
  events: [],
  error: ''
}

const adventure = (state = initialState, action) => {
  switch(action.type) {
    case LOAD_ADVENTURE:
      return {
        ...state,
        accessCode: action.accessCode,
        teamName: action.teamName,
        adventure: action.adventure,
        teamLeader: action.teamLeader,
        adventureName: action.adventureName,
        introduction: action.introduction,
        events: action.events,
        started: true
      };
    case LOAD_ADVENTURE_FAILED:
      return {
        ...state,
        error: action.error
      }
    case UPDATE_ADVENTURE_TAB:
      return {
        ...state,
        selectedTab: action.tabName
      };
    case UPDATE_MAP_TYPE:
      return {
        ...state,
        mapType: action.mapType
      };
    case ANSWER_QUESTION:
      return {
        ...state,
        events: state.events.map(event => event._id !== action.questionId? event: {
          ...event,
          answer: action.answer
        })
      };
    case SET_EVENT_VISIBILITY:
      return {
        ...state,
        events: state.events.map(event => event._id !== action.eventId? event: {
          ...event,
          visibility: action.visibility
        })
      };
    default:
      return state;
  }
};

export default adventure;