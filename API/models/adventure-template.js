const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const AdventureTemplateSchema = new Schema({
  _id: { type: Schema.ObjectId, default: ObjectId },
  dateCreated: { type: Date, default: () => new Date, required: true },
  userCreated: { type: Schema.ObjectId, required: true, ref: 'Users' },
  published: { type: Boolean, default: false, required: true },
  name: { type: String, required: true },
  questions: [{
    _id: { type: Schema.ObjectId, required: true, default: ObjectId },
    location: {
      long: { type: Number, required: true },
      lat: { type: Number, required: true }
    },
    question: { type: String, required: true },
    choices: [{
      _id: { type: Schema.ObjectId, required: true, default: ObjectId },
      name: { type: String, required: true }
    }],
    answer: { type: Schema.ObjectId, required: true }
  }]
});

module.exports = class AdventureTemplate extends mongoose.model('AdventureTemplate', AdventureTemplateSchema) {
  addQuestion(question) {
    this.questions.push(question);
  }
}