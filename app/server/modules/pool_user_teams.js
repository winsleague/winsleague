let prettyjson = Meteor.npmRequire( 'prettyjson' );

Modules.server.poolUserTeams = {
  refreshTeam(leagueId, seasonId, leagueTeamId) {
    log.info(`Finding PoolUserTeams who picked leagueTeamId: ${leagueTeamId}`);

    const poolUserTeams = PoolUserTeams.find({ leagueId, seasonId, leagueTeamIds: leagueTeamId });
    poolUserTeams.forEach(function(poolUserTeam) {
      Modules.server.poolUserTeams.refreshPoolUserTeam(leagueId, seasonId, poolUserTeam._id, poolUserTeam.leagueTeamIds);
    });
  },

  refreshPoolUserTeam(leagueId, seasonId, poolUserTeamId, leagueTeamIds) {
    log.info(`Refreshing PoolUserTeam: ${poolUserTeamId}`);

    var totalWins = 0, totalGames = 0, totalPlusMinus = 0;
    leagueTeamIds.forEach(function(leagueTeamId) {
      const seasonLeagueTeams = SeasonLeagueTeams.findOne({ leagueId, seasonId, leagueTeamId });
      if (seasonLeagueTeams) {
        totalWins += seasonLeagueTeams.wins;
        totalGames += seasonLeagueTeams.totalGames();
        totalPlusMinus += seasonLeagueTeams.pointsFor - seasonLeagueTeams.pointsAgainst;
      }
    });

    result = PoolUserTeams.update({ _id: poolUserTeamId },
      { $set: { totalWins, totalGames, totalPlusMinus } } );
    log.debug(`PoolUserTeams.update numberAffected: ${result.numberAffected}`);
  }
};
