export const INIT_ADVENTURE = 'INIT_ADVENTURE';
export const UPDATE_ADVENTURE_TAB = 'UPDATE_ADVENTURE_TAB';

export const initAdventure = ({
  adventureName,
  teamName,
  userMode,
  questions,
  accessCode
}) => ({
  type: INIT_ADVENTURE,
  accessCode,
  teamName,
  questions,
  userMode,
  adventureName
});

export const updateTab = (tabName) => ({
  type: UPDATE_ADVENTURE_TAB,
  tabName
});