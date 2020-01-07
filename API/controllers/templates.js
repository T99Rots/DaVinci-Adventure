const Router = require('koa-router');
const { requirePermissions } = require('../helpers/permissions');
const { permissions } = require('../models/users');
const AdventureTemplate = require('../models/adventure-template');

const router = new Router();

router.get('/', async (ctx, next) => {
  await requirePermissions(ctx, permissions.VIEW_TEMPLATES);

  ctx.body = (await AdventureTemplate.find({}).populate('userCreated').exec()).map(template => ({
    _id: template._id,
    name: template.name,
    userCreated: template.userCreated.name,
    dateCreated: template.dateCreated
  }));

  await next();
});

module.exports = router;