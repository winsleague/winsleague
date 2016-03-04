Meteor.publish('leagueTeams.ofLeague', leagueId => {
  check(leagueId, String);
  return LeagueTeams.find({ leagueId });
});
