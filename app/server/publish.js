


Meteor.publish('leaderboard', function () {
  const pool = Pools.findOne({}, { fields: {_id: 1} });
  const users = PoolUserTeams.find({ poolId: pool._id });
  if (users) { return users; }

  return this.ready();
});
