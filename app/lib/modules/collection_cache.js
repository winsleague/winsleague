const collectionCache = {};

Modules.collectionCache = {
  getCollection(name) {
    let cached = collectionCache[name];
    if (!cached) {
      cached = collectionCache[name] = new Mongo.Collection(name);
    }
    return cached;
  },
};
