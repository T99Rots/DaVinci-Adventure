const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const AdventureSchema = new Schema({
  _id: { type: Schema.ObjectId, default: ObjectId },
  accessCode: { type: Number, required: true },
  template: { type: Schema.ObjectId, required: true, ref: 'AdventureTemplate' },
  startTime: { type: Date, default: Date.now },
  duration: { type: Number, required: true, default: 7200000 },
  userStarted: { type: Schema.ObjectId, required: true, ref: 'User' },
  teams: [{
    _id: { type: Schema.ObjectId, required: true, default: ObjectId },
    accessCode: { type: Number, required: true },
    name: { type: String, required: true },
    creator: { type: Schema.ObjectId, required: true },
    players: [{
      _id: { type: Schema.ObjectId, required: true },
      name: { type: String, required: true },
      token: { type: String, required: true }
    }],
    answers: [{
      question: { type: Schema.ObjectId, required: true },
      answer: { type: Schema.ObjectId, required: true }
    }]
  }]
});

module.exports = class Adventure extends mongoose.model('Adventure', AdventureSchema) {
  startTeam(name) {
    this.teams.push({
      name,
      creator
    })
  }
}