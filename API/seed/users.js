const faker = require('faker/locale/nl');
const User = require('../models/users');
const seedConfig = require('../config/seed.json');

const saltRounds = 10;

const bcrypt = require('bcrypt');

global.faker = faker;

module.exports = async () => {
  await User.create({
    email: 'admin@davinci.local',
    passwordHash: await bcrypt.hash(seedConfig.users.defaultAdminPassword, saltRounds),
    permissions: [
      User.permissions.CREATE_ADVENTURE,
      User.permissions.MANAGE_TEMPLATES,
      User.permissions.START_ADVENTURE,
      User.permissions.VIEW_TEMPLATES,
    ],
    name: 'Admin'
  });
};