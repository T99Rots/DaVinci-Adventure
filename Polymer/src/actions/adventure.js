import { startAdventure } from '../event-logic';

export const LOAD_ADVENTURE = 'LOAD_ADVENTURE';
export const LOAD_ADVENTURE_FAILED = 'LOAD_ADVENTURE_FAILED';
export const UPDATE_ADVENTURE_TAB = 'UPDATE_ADVENTURE_TAB';
export const UPDATE_MAP_TYPE = 'UPDATE_MAP_TYPE';
export const ANSWER_QUESTION = 'ANSWER_QUESTION';
export const SET_EVENT_VISIBILITY = 'SET_EVENT_VISIBILITY';

const errors = {
  NO_ADVENTURE_STARTED: 'Je zit niet in een adventure'
}

export const loadAdventure = (args) => (dispatch, getState) => {
  if(getState().adventure.started) return;

  if(typeof args === 'object') {
    dispatch({
      type: LOAD_ADVENTURE,
      ...args
    });
    startAdventure({ 
      events: args.events,
      startTime: args.startTime
    });
  } else {
    if(localStorage.adventureStarted) {
      const events = JSON.parse(localStorage.events);
      dispatch({
        type: LOAD_ADVENTURE,
        accessCode: +localStorage.accessCode || 0,
        teamLeader: Boolean(localStorage.teamLeader),
        adventureName: localStorage.adventureName,
        introduction: localStorage.introduction,
        teamName: localStorage.teamName,
        startTime: localStorage.startTime,
        events,
      });
      startAdventure({
        startTime: localStorage.startTime,
        events
      });
    } else {
      dispatch({
        type: LOAD_ADVENTURE_FAILED,
        error: errors.NO_ADVENTURE_STARTED
      });
    }
  }
}

export const answerQuestion = (questionId, answer) => (dispatch, getState) => {
  dispatch({
    type: ANSWER_QUESTION,
    questionId,
    answer
  });
  localStorage.events = JSON.stringify(getState().adventure.events);
}

export const updateTab = (tabName) => ({
  type: UPDATE_ADVENTURE_TAB,
  tabName
});

export const updateMapType = mapType => ({
  type: UPDATE_MAP_TYPE,
  mapType
})

export const setEventVisibility = (eventId, visibility) => (dispatch, getState) => {
  dispatch({
    type: SET_EVENT_VISIBILITY,
    visibility,
    eventId
  });
  localStorage.events = JSON.stringify(getState().adventure.events);
}