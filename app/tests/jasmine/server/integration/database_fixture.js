/*
From https://gist.github.com/Sanjo/edbc0c1848de726b78d5

globals
 resetDatabase: true,
 loadDefaultFixtures: true,
 */

const Future = Npm.require('fibers/future');

resetDatabase = () => {
  log.info('Resetting database');

  // safety check
  if (!process.env.IS_MIRROR) {
    log.error('velocityReset is not allowed outside of a mirror. Something has gone wrong.');
    return false;
  }

  const fut = new Future();

  let collectionsRemoved = 0;
  const db = MongoInternals.defaultRemoteCollectionDriver().mongo.db;
  db.collections((err, collections) => {

    const appCollections = _.reject(collections, col => {
      return col.collectionName.indexOf('velocity') === 0 ||
        col.collectionName === 'system.indexes';
    });

    if (appCollections.length > 0) {
      _.each(appCollections, appCollection => {
        appCollection.remove(e => {
          if (e) {
            log.error('Failed removing collection', e);
            fut.return('fail: ' + e);
          }
          collectionsRemoved++;
          log.info('Removed collection');
          if (appCollections.length === collectionsRemoved) {
            log.info('Finished resetting database');
            fut.return('success');
          }
        });
      });
    } else {
      log.info('No collections found. No need to reset anything.');
      fut.return('success');
    }
  });

  return fut.wait();
};

loadDefaultFixtures = () => {
  log.info('Loading default fixtures');

  Modules.server.seeds.initializeLeagues();
  Accounts.createUser({ email: 'test@test.com' });

  log.info('Finished loading default fixtures');
};

beforeAll(() => {
  resetDatabase();
  loadDefaultFixtures();
});
