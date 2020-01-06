// const { db } = require('../db');

// const keyStoreCollection = db.collection('keyStore');

// exports.get = async (key) => {
//   return await (keyStoreCollection.findOne({ key })).value;
// }

// exports.set = async (key, value) => {
//   await keyStoreCollection.updateOne({ key }, { $set: { key, value } }, { upsert: true });
// }

// exports.delete = async (key) => {
//   await keyStoreCollection.deleteOne({ key });
// }

// exports.clear = async () => {
//   await keyStoreCollection.deleteMany({});
// }

// global.keyStore = exports;

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const KeyStoreSchema = new Schema({
  key: { unique: true, type: String, required: true },
  value: { type: Schema.Types.Mixed }
});

module.exports =  class KeyStore extends mongoose.model('KeyStore', KeyStoreSchema) {
  static async get(key) {
    return await (this.findOne({ key })).value;
  }

  static async set(key, value) {
    await this.updateOne({ key }, { key, value }, { upsert: true });
  }

  static async delete(key) {
    await this.deleteOne({ key });
  }

  static async clear() {
    await this.deleteMany({});
  }
}