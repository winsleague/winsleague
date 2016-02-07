Meteor.publish('leagueTeams.of_league', leagueId => {
  check(leagueId, String);
  return LeagueTeams.find({ leagueId });
});
