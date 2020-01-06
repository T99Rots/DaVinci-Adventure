const faker = require('faker/locale/nl');
const mongoose = require('mongoose');
const AdventureTemplate = require('../models/adventure-template');
const User = require('../models/users');
const config = require('../config/seed.json');

const ObjectId = mongoose.Types.ObjectId;

global.faker = faker;

const places = [
  { lat: 51.798905, long: 4.683271 },
  { lat: 51.800311, long: 4.679558 },
  { lat: 51.798352, long: 4.679551 },
  { lat: 51.813249, long: 4.666941 }
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
      name: faker.lorem.sentence(),
      questions: [],
      dateCreated: new Date(Date.now() - Math.floor(Math.random() * 1000*60*60*24*30)),
      userCreated: faker.random.arrayElement(users)._id
    };
    
    for(let i = 0; i < questionCount; i++) {
      const choiceCount = faker.random.number(config.templates.choices);
      const question = {
        location: faker.random.arrayElement(places),
        question: faker.lorem.sentence(),
        choices: []
      }

      for(let i = 0; i < choiceCount; i++) {
        question.choices.push({
          _id: ObjectId(),
          name: faker.lorem.sentence()
        });
      }

      question.answer = faker.random.arrayElement(question.choices)._id;

      template.questions.push(question);
    }

    templates.push(template);
  }

  await AdventureTemplate.create(templates);
};