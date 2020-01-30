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
const http = require('http');
// const WebSocket = require('ws');
// const { init: initBroadcast } = require('./ws-broadcast.js');

(async () => {
  const app = new Koa();

  const server = http.createServer(app.callback());

  // const wss = new WebSocket.Server({ 
  //   server,
  //   path: '/broadcast'
  // });

  // initBroadcast(wss);
  
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
  app.use(require('./helpers/permissions').userMiddleware);

  const router = new Router();

  const controllers = fs.readdirSync(path.join(__dirname, 'controllers'));

  for(const controllerPath of controllers) {
    const controller = require(path.join(__dirname, 'controllers', controllerPath));
    router.use(`/${path.parse(controllerPath).name}`, controller.routes(), controller.allowedMethods());
  }

  app.use(router.routes(), router.allowedMethods());

  server.listen(9001, '0.0.0.0');
})();