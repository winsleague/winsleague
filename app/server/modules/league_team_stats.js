Modules.server.leagueTeamStats = {
  refreshTeam(leagueId, seasonId, leagueTeamId) {
    log.info(`refreshingTeam: ${leagueId}, ${seasonId}, ${leagueTeamId}`);

    const games = Games.find({ leagueId, seasonId, status: "completed",
      $or: [{ homeTeamId: leagueTeamId },{ visitorTeamId: leagueTeamId }] });
    var wins = 0, losses = 0;
    games.forEach(function(game) {
      if (game.homeTeamId == leagueTeamId && game.homeScore > game.visitorScore) {
        wins += 1;
      }
      if (game.visitorTeamId == leagueTeamId && game.visitorScore > game.homeScore) {
        wins += 1;
      }
    });

    log.info(`wins: ${wins}`);

    // set wins
    LeagueTeamStats.upsert({ leagueId, seasonId, leagueTeamId },
      { $set: { wins } } );
  }
};
