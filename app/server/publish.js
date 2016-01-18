Meteor.publish('leagues', function() {
  return Leagues.find({});
});

Meteor.publish('seasons', function() {
  return Seasons.find({});
});

Meteor.publish('singlePool', function(_id) {
  check(_id, String);
  return Pools.find({ _id });
});

Meteor.publish('poolTeams', function(poolId) {
  check(poolId, String);
  return PoolTeams.find({ poolId });
});

Meteor.publish('leagueTeams', function(leagueId) {
  check(leagueId, String);
  return LeagueTeams.find({ leagueId });
});
