


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

Meteor.publish('singlePool', function(id) {
  check(id, String);
  return Pools.find({ _id: id });
});

Meteor.publish('poolTeams', function(poolId) {
  check(poolId, String);
  return PoolTeams.find({ poolId });
});
