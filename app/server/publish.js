


Meteor.publish('leaderboard', function () {
  const pool = Pools.findOne({}, { fields: {_id: 1} });
  const users = PoolUserTeams.find({ poolId: pool._id });
  if (users) { return users; }

  return this.ready();
});

Meteor.publish('leagues', function () {
  return Leagues.find({});
});

Meteor.publish('seasons', function () {
  return Seasons.find({});
});

Meteor.publish('singlePool', function(id) {
  const pool = Pools.find({ _id: id });
  const users = PoolUserTeams.find({ poolId: id });
  return [pool, users];
});
