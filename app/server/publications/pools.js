Meteor.publish('pools.single', _id => {
  check(_id, String);
  return Pools.find(_id);
});

Meteor.publish('pools.of_user', function(userId) {
  if (!userId) return this.ready();
  check(userId, String);
  return Pools.find({ commissionerUserId: userId }, { fields: { _id: 1, name: 1 } });
  // TODO: this should also return Pools that users are a part of, but aren't a commissioner in
});

Meteor.publish('pools.single.latestSeason', _id => {
  check(_id, String);
  const pool = Pools.findOne(_id);
  const leagueId = pool.leagueId;
  return Modules.seasons.getLatestCursorByLeagueId(leagueId);
});
