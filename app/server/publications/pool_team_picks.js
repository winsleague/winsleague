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
