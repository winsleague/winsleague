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

Meteor.publish('userPoolTeams', userId => {
  check(userId, String);
  return Pools.find({ commissionerUserId: userId });
});

Meteor.publish('leagueTeams', leagueId => {
  check(leagueId, String);
  return LeagueTeams.find({ leagueId });
});

