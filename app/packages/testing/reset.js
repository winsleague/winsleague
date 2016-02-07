function resetDatabase() {
  // safety check
  if (!process.env.IS_MIRROR) {
    throw new Meteor.Error(
      'NOT_ALLOWED',
      'velocityReset is not allowed outside of a mirror. Something has gone wrong.'
    );
  }

  const db = MongoInternals.defaultRemoteCollectionDriver().mongo.db;
  const collections = Meteor.wrapAsync(db.collections, db)();
  const appCollections = _.reject(collections, (col) => {
    return col.collectionName.indexOf('velocity') === 0 ||
      col.collectionName === 'system.indexes' ||
      col.collectionName === 'users';
  });

  _.each(appCollections, (appCollection) => {
    log.debug('reset collection ' + appCollection.collectionName);
    Meteor.wrapAsync(appCollection.remove, appCollection)();
  });
}

function resetTestingEnvironment() {
  if (process.env.IS_MIRROR) {
    resetDatabase();
  } else {
    throw new Meteor.Error(
      'NOT_ALLOWED',
      'resetTestingEnvironment can only be executed in a Velocity mirror.'
    );
  }
}

Meteor.methods({
  resetTestingEnvironment,
});
