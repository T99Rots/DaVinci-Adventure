console.clear();
const mongoose = require('mongoose');
const config = require('./config/default.json');
const fs = require('fs');
const path = require('path');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Router = require('koa-router');
const cors = require('@gem-mine/cors').default;
const errorHandler = require('koa-better-error-handler');

(async () => {
  const app = new Koa();
  
  await mongoose.connect(config.mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  Object.assign(global, {
    keyValueModel: require('./models/key-store'),
    templateModel: require('./models/adventure-template'),
    userModel: require('./models/users')
  })
  
  app.context.onerror = errorHandler

  app.use(bodyParser());
  app.use(cors({
    origins: /^https?:\/\/(localhost|192\.168\.0\.4):900[10]$/
  }));

  const router = new Router();

  const controllers = fs.readdirSync(path.join(__dirname, 'controllers'));

  for(const controllerPath of controllers) {
    const controller = require(path.join(__dirname, 'controllers', controllerPath));
    router.use(`/${path.parse(controllerPath).name}`, controller.routes(), controller.allowedMethods());
  }

  app.use(router.routes(), router.allowedMethods());

  app.listen(9001, '0.0.0.0')
})();