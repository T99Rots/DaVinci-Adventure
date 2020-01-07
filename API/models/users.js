const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const permissions = {
  START_ADVENTURE: 'START_ADVENTURE',
  VIEW_TEMPLATES: 'VIEW_TEMPLATES',
  MANAGE_TEMPLATES: 'MANAGE_TEMPLATES'
}

const UserSchema = new Schema({
  _id: { type: Schema.ObjectId, default: ObjectId },
  email: { type: String, required: true },
  name: { type: String, required: true },
  passwordHash: { type: String },
  permissions: [
    { type: String, enum: Object.values(permissions) }
  ],
  tokens: []
});

module.exports = class User extends mongoose.model('User', UserSchema) {
  static permissions = permissions;

  async addToken (token) {
    this.tokens.push(token);
    await this.save();
  }

  async removeToken (token) {
    this.tokens = this.tokens.filter(t => t !== token);
    await this.save();
  }
};