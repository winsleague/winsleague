Meteor.publish('poolTeams.of_pool', function (poolId, seasonId = null) {
  check(poolId, String);
  let actualSeasonId;
  if (seasonId) {
    check(seasonId, String);
    actualSeasonId = seasonId;
  } else {
    const pool = Pools.findOne({ _id: poolId });
    if (!pool) return this.ready();
    const leagueId = pool.leagueId;
    const latestSeason = Seasons.findOne({ leagueId }, { sort: ['year', 'desc'] });
    if (!latestSeason) throw new Error(`No season found for leagueId ${leagueId}`);
    actualSeasonId = latestSeason._id;
  }
  return PoolTeams.find({ poolId, seasonId: actualSeasonId });
});

Meteor.publish('poolTeams.single', function (_id) {
  check(_id, String);
  return PoolTeams.find({ _id });
});
