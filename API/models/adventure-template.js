const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const AdventureTemplateSchema = new Schema({
  _id: { type: Schema.ObjectId, default: ObjectId },
  dateCreated: { type: Date, default: () => new Date, required: true },
  userCreated: { type: Schema.ObjectId, required: true, ref: 'User' },
  published: { type: Boolean, default: false, required: true },
  name: { type: String, required: true },
  introduction: { type: String },
  area: [[ Number ]],
  events: [{
    _id: { type: Schema.ObjectId, required: true, default: ObjectId },
    type: { type: String, enum: ['question', 'info'], required: true, default: 'info' },
    title: { type: String, required: true },
    body:  { type: String },
    triggers: [{
      type: { type: String, enum: ['location', 'time'], required: true },
      location: {
        long: { type: Number },
        lat: { type: Number }
      },
      time: { type: Number }
    }],
    choices: [{
      _id: { type: Schema.ObjectId, default: ObjectId },
      name: { type: String }
    }],
    answer: { type: Schema.ObjectId }
  }]
});

module.exports = mongoose.model('AdventureTemplate', AdventureTemplateSchema);