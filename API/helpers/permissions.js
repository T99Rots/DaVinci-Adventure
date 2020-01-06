const User = require('../models/users');

const errors = {
  MISSING_HEADERS: 'Gebruikersinformatie incompleet',
  INVALID_ID: 'Invalide gebruikers ID',
  USER_DOES_NOT_EXIST: 'Gebruiker bestaat niet',
  INVALID_TOKEN: 'Ongeldige toegangs token',
  NO_PERMISSIONS: 'Je hebt geen toegang tot deze actie'
}

const userCache = new Map();

exports.resetUserCache = async (userId) => {
  const user = await User.findOne({ _id: userId });
  if(!user) throw new Error(`User with id ${userId} does not exist`);
  userCache.delete(userId);
  userCache.set(userId, {
    lastRequest: Date.now(),
    user
  });
}

exports.requirePermissions = async (ctx, permissions) => {
  if(typeof permissions === 'string') permissions = [permissions];
  const token = ctx.headers['x-auth-token'];
  const userId = ctx.headers['x-auth-user'];
  ctx.assert(token && userId, 401, errors.MISSING_HEADERS);

  let user = userCache.get(userId);
  if(!user) {
    ctx.assert(/^[a-f\d]{24}$/i.test(userId), 401, errors.INVALID_ID);
    user = await User.findOne({ _id: userId });
    ctx.assert(user, 401, errors.USER_DOES_NOT_EXIST);
    userCache.set(userId, {
      lastRequest: Date.now(),
      user
    });
  } else {
    user = user.user;
  }

  ctx.assert(user.tokens.includes(token), 401, errors.INVALID_TOKEN);
  ctx.assert(!permissions.some(permission => !user.permissions.includes(permission)), 401, errors.NO_PERMISSIONS);
}

setInterval(() => {
  userCache.forEach((value, key) => {
    if(value.lastRequest + 15 * 60 * 1000 < Date.now()) {
      userCache.delete(key);
    } 
  });
}, 1000 * 60);