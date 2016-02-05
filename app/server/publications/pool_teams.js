Meteor.publish('poolTeams.of_pool', function (poolId, seasonId = null) {
  check(poolId, String);
  let actualSeasonId;
  if (seasonId) {
    check(seasonId, String);
    actualSeasonId = seasonId;
  } else {
    const leagueId = Pools.findOne({ _id: poolId }).leagueId;
    const latestSeason = Seasons.findOne({ leagueId }, { sort: ['year', 'desc'] });
    if (!latestSeason) {
      log.error(`No season found for leagueId ${leagueId}`);
      return this.ready();
    }
    actualSeasonId = latestSeason._id;
  }
  return PoolTeams.find({ poolId, seasonId: actualSeasonId });
});

Meteor.publish('poolTeam.single', function (poolTeamId) {
  check(poolTeamId, String);
  return PoolTeams.findOne({ _id: poolTeamId });
});
