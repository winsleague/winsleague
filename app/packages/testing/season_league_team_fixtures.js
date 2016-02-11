function createSeasonLeagueTeam(seasonLeagueTeam) {
  log.debug(`Creating seasonLeagueTeam:`, seasonLeagueTeam);
  const seasonLeagueTeamId = SeasonLeagueTeams.insert(seasonLeagueTeam);
  log.debug(`seasonLeagueTeamId: ${seasonLeagueTeamId}`);
  return SeasonLeagueTeams.findOne(seasonLeagueTeamId);
}

function createDefaultSeasonLeagueTeam() {
  const leagueId = Leagues.findOne()._id;
  const seasonId = Modules.seasons.getLatestByLeagueId(leagueId)._id;
  const leagueTeamId = LeagueTeams.findOne({ leagueId })._id;
  const seasonLeagueTeam = {
    leagueId,
    seasonId,
    leagueTeamId,
    wins: 10,
    losses: 6,
    ties: 0,
    homeWins: 6,
    homeLosses: 3,
    homeTies: 0,
    awayWins: 4,
    awayLosses: 3,
    awayTies: 0,
    pointsFor: 17,
    pointsAgainst: 14,
  };

  return createSeasonLeagueTeam(seasonLeagueTeam);
}

Meteor.methods({
  'fixtures/seasonLeagueTeams/create': createSeasonLeagueTeam,
  'fixtures/seasonLeagueTeams/createDefault': createDefaultSeasonLeagueTeam,
});
