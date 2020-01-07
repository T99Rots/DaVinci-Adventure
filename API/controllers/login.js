const Router = require('koa-router');
const { generateAccessCode, generateToken } = require('../helpers/login');
const { resetUserCache } = require('../helpers/permissions');
const User = require('../models/users');
const bcrypt = require('bcrypt');

const errors = {
  EMAIL_INVALID: 'Opgegeven email is geen valide email adres',
  EMAIL_DOES_NOT_EXIST: 'Er is geen account met dit email adres',
  WRONG_PASSWORD: 'Verkeerd wachtwoord of email adres'
}

const emailRegex = new RegExp([
  '(?:[a-z0-9!#$%&\'*+\/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+\/=?^_`{|}~-]+)*|\"(?:[\\x01-\\x08',
  '\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])',
  '*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:2',
  '5[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-',
  '9-]*[a-z0-9]:(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\\\[\\x01-\\x09',
  '\\x0b\\x0c\\x0e-\\x7f])+)\\])'
].join(''));

global.generateAccessCode = generateAccessCode;

const router = new Router();

router.post('/email', async (ctx, next) => {
  const email = ctx.request.body.email.toLowerCase().trim();
  const password = ctx.request.body.password;

  console.log(email, password);

  ctx.assert(emailRegex.test(email), 400, errors.EMAIL_INVALID);

  const user = await User.findOne({ email });

  ctx.assert(user, 400, errors.EMAIL_DOES_NOT_EXIST);
  ctx.assert(await bcrypt.compare(password, user.passwordHash), 400, errors.WRONG_PASSWORD);

  const token = generateToken();

  await user.addToken(token);

  await resetUserCache(user._id.toString());

  ctx.body = {
    token,
    userId: user._id,
    loginType: 'admin',
    permissions: user.permissions
  }

  await next();
});

router.post('/logout', async (ctx, next) => {
  
});

module.exports = router;