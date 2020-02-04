console.clear()

const mongoose = require('mongoose');
const config = require('./config/config');
const seedConfig = require('./config/seed');
const path = require('path');

(async () => {
  await mongoose.connect(config.mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  for(const seeder of seedConfig.seeders) {
    await require(path.join(__dirname, './seed/', seeder))();
  }

  console.log('Seeding completed!');
  process.exit();
})()