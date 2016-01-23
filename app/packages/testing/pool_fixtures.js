function createPool(pool) {
  log.debug(`Creating pool:`, pool);
  const poolId = Pools.insert(pool);
  log.debug(`poolId: ${poolId}`);
  return Pools.findOne(poolId);
}

function createDefaultPool() {
  const leagueId = Leagues.findOne({ name: 'NFL' }, { fields: { _id: 1 } })._id;
  const seasonId = Seasons.findOne({ leagueId }, { fields: { _id: 1 } })._id;
  const pool = {
    leagueId,
    seasonId,
    name: 'test',
    commissionerUserId: Meteor.userId(),
  };

  return createPool(pool);
}

Meteor.methods({
  'fixtures/pools/create': createPool,
  'fixtures/pools/createDefault': createDefaultPool,
});
