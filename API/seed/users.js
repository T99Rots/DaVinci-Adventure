const faker = require('faker/locale/nl');
const User = require('../models/users');
const seedConfig = require('../config/seed');

const saltRounds = 10;

const bcrypt = require('bcrypt');

global.faker = faker;

module.exports = async () => {
  await User.create({
    email: 'admin@davinci.local',
    passwordHash: await bcrypt.hash(seedConfig.users.defaultAdminPassword, saltRounds),
    permissions: Object.values(User.permissions),
    name: 'Admin'
  });
};