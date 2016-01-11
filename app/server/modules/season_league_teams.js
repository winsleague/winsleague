let prettyjson = Meteor.npmRequire('prettyjson');

Modules.server.seasonLeagueTeams = {
  refreshTeamStats(leagueId, seasonId, leagueTeamId) {
    log.info(`Refreshing stats for seasonLeagueTeam: ${leagueTeamId}`);

    const games = Games.find({ leagueId, seasonId, status: "completed",
      $or: [{ homeTeamId: leagueTeamId },{ awayTeamId: leagueTeamId }] });
    var wins = 0, losses = 0, ties = 0,
      homeWins = 0, homeLosses = 0, homeTies = 0,
      awayWins = 0, awayLosses = 0, awayTies = 0,
      pointsFor = 0, pointsAgainst = 0;
    games.forEach(function(game) {
      if (game.homeTeamId == leagueTeamId) {
        if (game.homeScore > game.awayScore) {
          wins += 1;
          homeWins += 1;
        } else if (game.homeScore < game.awayScore) {
          losses += 1;
          homeLosses += 1;
        } else {
          ties += 1;
          homeTies += 1;
        }
        pointsFor += game.homeScore;
        pointsAgainst += game.awayScore;
      } else if (game.awayTeamId == leagueTeamId) {
        if (game.awayScore > game.homeScore) {
          wins += 1;
          awayWins += 1;
        } else if (game.awayScore < game.homeScore) {
          losses += 1;
          awayLosses += 1;
        } else {
          ties += 1;
          awayTies += 1;
        }
        pointsFor += game.awayScore;
        pointsAgainst += game.homeScore;
      }
    });

    result = SeasonLeagueTeams.upsert({ leagueId, seasonId, leagueTeamId },
      { $set: {
        wins, losses, ties,
        homeWins, homeLosses, homeTies,
        awayWins, awayLosses, awayTies,
        pointsFor, pointsAgainst
      } } );
    log.debug(`seasonLeagueTeams.upsert numberAffected: ${result.numberAffected}`);
  }
};
