Meteor.publish('poolTeamPicks.ofPoolTeam', function(poolTeamId) {
  if (!poolTeamId) return this.ready();
  check(poolTeamId, String);

  return PoolTeamPicks.find({ poolTeamId });
});

