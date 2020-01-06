const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const GameSessionSchema = new Schema({
  _id: ObjectId,
  accessCode: { type: Number, unique: true,  },
  adventureTemplate: { type: ObjectId, required: true },
  startTime: { type: Date, default: Date.now },
  teams: [{
    _id: ObjectId,
    name: String,
    creator: ObjectId,
    players: [{
      _id: ObjectId,
      name: String
    }],
    answers: [{
      question: ObjectId,
      answer: ObjectId
    }]
  }]
});

module.exports = class GameSession extends mongoose.model('GameSession', GameSessionSchema) {
  constructor(templateId) {
    super({
      adventureTemplate: templateId,
      teams: []
    })
  }

  startTeam(name) {
    this.teams.push({
      name,
      creator
    })
  }
}