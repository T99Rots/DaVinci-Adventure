console.clear();
const mongoose = require('mongoose');
const config = require('./config/config');
const fs = require('fs');
const path = require('path');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Router = require('koa-router');
const cors = require('@gem-mine/cors').default;
const errorHandler = require('koa-better-error-handler');
const http = require('http');
const yargs = require('yargs').argv;
const localtunnel = require('localtunnel');
const fetch = require('node-fetch');

(async () => {
  const publicMode = Boolean(yargs.public);
  const app = new Koa();

  const server = http.createServer(app.callback());

  if(publicMode) {
    const tunnel = await localtunnel({
      port: 9001,
      subdomain: 'davinci-adventure-game'
    });
    console.log(`service available on ${tunnel.url}`);
  }

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
  app.use(cors({
    origins: /^https?:\/\/(localhost|192\.168\.0\.4):900[10]$/
  }));
  app.use(bodyParser());
  app.use(require('./helpers/permissions').userMiddleware);

  const router = new Router();

  const controllers = fs.readdirSync(path.join(__dirname, 'controllers'));

  for(const controllerPath of controllers) {
    const controller = require(path.join(__dirname, 'controllers', controllerPath));
    router.use(`${publicMode? '/api': ''}/${path.parse(controllerPath).name}`, controller.routes(), controller.allowedMethods());
  }

  if(publicMode) {
    router.get('*', async (ctx, next) => {
      if(ctx.response.status === 404 && !ctx.body) {
        if(ctx.request.url.startsWith('/api')) {
          ctx.response.status = 404;
        } else {
          const res = await fetch('http://localhost:9000' + ctx.request.url, {
            headers: ctx.headers
          });
          if(res.status === 200) {
            // console.log(ctx.response.headers, res.headers);
            ctx.response.set({
              'content-type': res.headers.get('content-type')
            });
            ctx.body = await res.text();
          }
        }
      }
      next();
    });
  }

  app.use(router.routes(), router.allowedMethods());

  server.listen(9001, '0.0.0.0');
})();