Meteor.publish('poolTeamPicks.single', function(poolTeamPickId) {
  if (!poolTeamPickId) return this.ready();
  check(poolTeamPickId, String);

  return PoolTeamPicks.find(poolTeamPickId);
});

Meteor.publish('poolTeamPicks.ofPoolTeam', function(poolTeamId) {
  if (!poolTeamId) return this.ready();
  check(poolTeamId, String);

  return PoolTeamPicks.find({ poolTeamId });
});

Meteor.publish('poolTeamPicks.ofPool', function(poolId, seasonId = null) {
  if (!poolId) return this.ready();
  check(poolId, String);

  if (seasonId) {
    check(seasonId, String);
    return PoolTeamPicks.find({ poolId, seasonId });
  } else {
    return PoolTeamPicks.find({ poolId });
  }
});
