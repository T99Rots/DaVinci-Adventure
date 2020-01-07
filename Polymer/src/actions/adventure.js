export const INIT_ADVENTURE = 'INIT_ADVENTURE';

export const initAdventure = (teamName, userMode, questions, accessCode) => ({
  type: INIT_ADVENTURE,
  accessCode,
  teamName,
  questions,
  userMode
});