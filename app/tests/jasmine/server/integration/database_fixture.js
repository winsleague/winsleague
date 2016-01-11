/*
From https://gist.github.com/Sanjo/edbc0c1848de726b78d5

globals
 resetDatabase: true,
 loadDefaultFixtures: true,
 */

var Future = Npm.require('fibers/future');

resetDatabase = function () {
  console.log('Resetting database');

  // safety check
  if (!process.env.IS_MIRROR) {
    console.error('velocityReset is not allowed outside of a mirror. Something has gone wrong.');
    return false;
  }

  var fut = new Future();

  var collectionsRemoved = 0;
  var db = MongoInternals.defaultRemoteCollectionDriver().mongo.db;
  db.collections(function (err, collections) {

    var appCollections = _.reject(collections, function (col) {
      return col.collectionName.indexOf('velocity') === 0 ||
        col.collectionName === 'system.indexes';
    });

    if (appCollections.length > 0) {
      _.each(appCollections, function (appCollection) {
        appCollection.remove(function (e) {
          if (e) {
            console.error('Failed removing collection', e);
            fut.return('fail: ' + e);
          }
          collectionsRemoved++;
          console.log('Removed collection');
          if (appCollections.length === collectionsRemoved) {
            console.log('Finished resetting database');
            fut['return']('success');
          }
        });
      });
    } else {
      console.log('No collections found. No need to reset anything.');
      fut['return']('success');
    }

  });

  return fut.wait();
};

loadDefaultFixtures = function () {
  console.log('Loading default fixtures');

  Modules.server.seeds.createLeagues();

  console.log('Finished loading default fixtures');
};

beforeAll(function () {
  resetDatabase();
  loadDefaultFixtures();
});
