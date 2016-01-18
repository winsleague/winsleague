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
    log.info('remove ' + appCollection.collectionName);
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

function createUser(userData) {
  let user = Accounts.findUserByEmail(userData.email);

  if (!user) {
    const userId = Accounts.createUser(userData);
    user = Meteor.users.findOne(userId);
  }

  return user;
}

function createDefaultUser() {
  return createUser({
    email: 'test@test.com',
    password: 'test',
  });
}

function createDefaultLeagues() {
  let leagueId = Leagues.insert({ name: 'NFL' });
  LeagueTeams.insert({ leagueId, cityName: 'New York', mascotName: 'Giants',
    abbreviation: 'NYG', conference: 'NFC', division: 'East' });
  LeagueTeams.insert({ leagueId, cityName: 'Seattle', mascotName: 'Seahawks',
    abbreviation: 'SEA', conference: 'NFC', division: 'West' });
  Seasons.insert({ leagueId, year: 2015 });

  leagueId = Leagues.insert({ name: 'NBA' });
  LeagueTeams.insert({ leagueId, cityName: 'New York', mascotName: 'Knicks',
    abbreviation: 'NYK', conference: 'East' });
  LeagueTeams.insert({ leagueId, cityName: 'Seattle', mascotName: 'Supersonics',
    abbreviation: 'SEA', conference: 'West' });
  Seasons.insert({ leagueId, year: 2015 });
}

function createPool(pool) {
  const poolId = Pools.insert(pool);
  return Pools.findOne(poolId);
}

function createDefaultPool() {
  const pool = {
    leagueId: Leagues.findOne({ name: 'NFL' }, { fields: { leagueId: 1 } }),
    name: 'test',
  };

  return createPool(pool);
}

Meteor.methods({
  resetTestingEnvironment,
  'fixtures/leagues/createDefault': createDefaultLeagues,
  'fixtures/users/create': createUser,
  'fixtures/users/createDefault': createDefaultUser,
  'fixtures/pools/create': createPool,
  'fixtures/pools/createDefault': createDefaultPool,
});
