


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
  const pool = Pools.find({ _id: id });
  const users = PoolTeams.find({ poolId: id });
  return [pool, users];
});
