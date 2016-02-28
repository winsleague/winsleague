function createPool(pool) {
  log.debug(`Creating pool:`, pool);
  const poolId = Pools.insert(pool);
  log.debug(`poolId: ${poolId}`);
  return Pools.findOne(poolId);
}

function createDefaultPool() {
  const leagueId = Leagues.findOne()._id;
  const pool = {
    leagueId,
    name: 'test',
    commissionerUserId: getDefaultUserId(),
  };

  return createPool(pool);
}

Fixtures.pools = {
  createPool,
  createDefaultPool,
};

Meteor.methods({
  'fixtures/pools/create': createPool,
  'fixtures/pools/createDefault': createDefaultPool,
});
