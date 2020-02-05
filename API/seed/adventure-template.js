const faker = require('faker/locale/nl');
const mongoose = require('mongoose');
const AdventureTemplate = require('../models/adventure-template');
const User = require('../models/users');
const config = require('../config/seed');

const ObjectId = mongoose.Types.ObjectId;

global.faker = faker;

const places = [
  { lat: 51.798905, long: 4.683271 },
  { lat: 51.800311, long: 4.679558 },
  { lat: 51.798352, long: 4.679551 },
  { lat: 51.813249, long: 4.666941 }
]

const area = [
  [51.7966223, 4.6791831],
  [51.797392, 4.6825949],
  [51.7974982, 4.6827988],
  [51.7976641, 4.6828631],
  [51.798719, 4.6833352],
  [51.7985863, 4.6842042],
  [51.7991171, 4.6844188],
  [51.7992565, 4.6834961],
  [51.7992233, 4.6833888],
  [51.7989314, 4.6832708],
  [51.7990375, 4.6815971],
  [51.799283, 4.6798591],
  [51.7968148, 4.6788827],
  [51.7966223, 4.6791831]
]

module.exports = async () => {
  const users = await User.find({ permissions: User.permissions.MANAGE_TEMPLATES });

  if(users.length < 1) throw new Error('No users generated / in database, check seeding order');

  const templates = [];
  const templateCount = faker.random.number(config.templates.count);
  
  for(let i = 0; i < templateCount; i++) {
    const questionCount = faker.random.number(config.templates.questions);
    const template = {
      published: Math.random() > 0.12,
      name: faker.lorem.words(),
      introduction: faker.lorem.paragraph(),
      events: [],
      dateCreated: new Date(Date.now() - Math.floor(Math.random() * 1000*60*60*24*30)),
      userCreated: faker.random.arrayElement(users)._id,
      area
    };
    
    for(let i = 0; i < questionCount; i++) {
      const choiceCount = faker.random.number(config.templates.choices);

      const event = {
        title: faker.lorem.sentence(),
        type: Math.random() > 0.75? 'info': 'question',
        triggers: []
      }

      if(event.type === 'question') {
        event.choices = [];
        for(let i = 0; i < choiceCount; i++) {
          event.choices.push({
            _id: ObjectId(),
            name: faker.lorem.sentence()
          });
        }
        event.answer = faker.random.arrayElement(event.choices)._id;
      } else {
        event.body = faker.lorem.sentence();
      }

      if(Math.random() > .5) {
        event.triggers.push({
          type: 'location',
          location: faker.random.arrayElement(places)
        });
      } else if(Math.random() > .7) {
        event.triggers.push({
          type: 'location',
          location: faker.random.arrayElement(places)
        }, {
          type: 'time',
          time: Math.floor((Math.random() * 90 * 60) + (15 * 60)) * 1000
        });
      } else {
        event.triggers.push({
          type: 'time',
          time: Math.floor((Math.random() * 90 * 60) + (15 * 60)) * 1000
        });
      }
      template.events.push(event);
    }
    templates.push(template);
  }

  await AdventureTemplate.create(templates);
};