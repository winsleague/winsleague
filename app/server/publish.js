


Meteor.publish('leaderboard', function() {
  const pool = Pools.findOne({}, { fields: {_id: 1} });
  const users = PoolTeams.find({ poolId: pool._id });
  if (users) { return users; }

  return this.ready();
});

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
