const Adventure = require('../models/adventure');
global.adventureModel = Adventure
const config = require('../config/config');

const errors = {
  CODE_WRONG_FORMAT: 'Code moet een 6 cijfer getal zijn',
  INVALID_CODE: (code) => `Geen adventure of team met code ${code}`
}

exports.lookupAccessCode = async (ctx) => {
  const { accessCode } = ctx.request.body;

  ctx.assert(
    typeof accessCode === 'number' && accessCode >= 0 && accessCode < 10 ** config.codeLength - 1,
    422,
    errors.CODE_WRONG_FORMAT
  );

  let adventure = await Adventure.findOne({ accessCode }).populate('template').exec();
  let team;

  if(!adventure) {
    adventure = await Adventure.findOne({ teams: { $elemMatch: { accessCode } } }).populate('template').exec();
    ctx.assert(adventure, 404, errors.INVALID_CODE(accessCode));
    team = adventure.teams.find(team => team.accessCode === accessCode);
  }

  const returnObj = {
    adventure,
    type: 'create-team'
  };

  if(team) {
    returnObj.type = 'join-team'
    returnObj.team = team;
  };

  return returnObj;
}

exports.cleanAdventureTemplate = (template) => ({
  adventureName: template.name,
  introduction: template.introduction,
  area: template.area,
  events: template.events.map(event => ({
    _id: event._id,
    title: event.title,
    body: event.body,
    type: event.type,
    choices: event.choices,
    triggers: event.triggers
  }))
});
