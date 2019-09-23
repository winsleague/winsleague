import { Mongo } from 'meteor/mongo';

const collectionCache = {};

export default {
  getCollection(name) {
    let cached = collectionCache[name];
    if (!cached) {
      collectionCache[name] = new Mongo.Collection(name);
      cached = collectionCache[name];
    }
    return cached;
  },
};
