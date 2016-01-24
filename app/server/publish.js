Meteor.publish('leagues', () => Leagues.find({}));

Meteor.publish('seasons', () => Seasons.find({}));

Meteor.publish('singlePool', _id => {
  check(_id, String);
  return Pools.find({ _id });
});

Meteor.publish('poolTeams', poolId => {
  check(poolId, String);
  return PoolTeams.find({ poolId });
});

Meteor.publish('userPoolTeams', function(userId) {
  if (!userId) return this.ready();
  check(userId, String);
  return Pools.find({ commissionerUserId: userId });
  // TODO: this should also return Pools that users are a part of, but aren't a commissioner in
});

Meteor.publish('leagueTeams', leagueId => {
  check(leagueId, String);
  return LeagueTeams.find({ leagueId });
});

