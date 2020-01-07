const Router = require('koa-router');
const { Types: { ObjectId } } = require('mongoose');
const { generateAccessCode, generateToken } = require('../helpers/login');
const { requirePermissions } = require('../helpers/permissions');
const { lookupAccessCode, cleanAdventureTemplate } = require('../helpers/adventure');
const Adventure = require('../models/adventure');
const adventureTemplate = require('../models/adventure-template');
const User = require('../models/users');
const { permissions } = User;

const errors = {
  NO_TEMPLATE_ID: 'NO_TEMPLATE_ID',
  DURATION_MISSING: 'DURATION_MISSING',
  TEMPLATE_DOES_NOT_EXISTS: 'Template bestaat niet',
  NAME_REQUIRED: 'Naam is verplicht',
  TEAM_NAME_REQUIRED: 'Team naam is verplicht',
}

const router = new Router();

router.post('/start', async (ctx, next) => {
  await requirePermissions(ctx, [
    permissions.START_ADVENTURE,
    permissions.MANAGE_TEMPLATES
  ], 'any');

  const {
    template,
    duration = 1000 * 60 * 60 * 2
  } = ctx.request.body;

  ctx.assert(/^[a-f\d]{24}$/i.test(template), 400, errors.NO_TEMPLATE_ID);
  ctx.assert(duration, 400, errors.DURATION_MISSING);

  ctx.assert(await adventureTemplate.countDocuments({_id: ObjectId(template)}) > 0, 404, errors.TEMPLATE_DOES_NOT_EXISTS);

  const accessCode = await generateAccessCode();

  await Adventure.create({
    template: ObjectId(template),
    accessCode,
    userStarted: ctx.user._id,
    adventureTemplate: template,
    duration
  });

  ctx.body = {
    accessCode
  };

  await next();
});

router.post('/check-access-code', async (ctx, next) => {
  const {
    adventure,
    team,
    type
  } = await lookupAccessCode(ctx);

  ctx.body = {
    type,
    adventureName: adventure.template.name
  }

  if(type === 'join-team') ctx.body.teamName = team.name;

  next();
});

router.post('/join', async (ctx, next) => {
  const {
    name,
    teamName
  } = ctx.request.body;

  ctx.assert(name, 422, errors.NAME_REQUIRED);

  const {
    adventure,
    team,
    type
  } = await lookupAccessCode(ctx);


  const player = {
    _id: ObjectId(),
    name,
    token: generateToken()
  };

  if(type === 'create-team') {
    ctx.assert(teamName, 422, errors.TEAM_NAME_REQUIRED);
    const accessCode = await generateAccessCode();
    const team = {
      accessCode,
      creator: player._id,
      name: teamName,
      players: [ player ],
      answers: []
    }
    adventure.teams.push(team);
    await adventure.save();

    ctx.body = {
      accessCode,
      token: player.token,
      userId: player._id,
      loginType: 'adventure-team-leader',
      ...cleanAdventureTemplate(adventure.template)
    }
  } else {
    team.players.push(player);
    await adventure.save();
    ctx.body = {
      teamName: team.name,
      token: player.token,
      userId: player._id,
      loginType: 'adventure-player',
      ...cleanAdventureTemplate(adventure.template)
    }
  }

  await next();
});


module.exports = router;