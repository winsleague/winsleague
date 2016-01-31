Meteor.publish('leagues', () => Leagues.find({}));

Meteor.publish('seasons', () => Seasons.find({}));

Meteor.publish('singlePool', _id => {
  check(_id, String);
  return Pools.find({ _id });
});

Meteor.publish('poolTeams', function (poolId, seasonId = null) {
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

Meteor.publish('userPools', function(userId) {
  if (!userId) return this.ready();
  check(userId, String);
  return Pools.find({ commissionerUserId: userId });
  // TODO: this should also return Pools that users are a part of, but aren't a commissioner in
});

Meteor.publish('leagueTeams', leagueId => {
  check(leagueId, String);
  return LeagueTeams.find({ leagueId });
});
