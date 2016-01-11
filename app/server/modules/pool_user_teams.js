let prettyjson = Meteor.npmRequire( 'prettyjson' );

Modules.server.poolUserTeams = {
  refreshWhoPickedLeagueTeam(leagueId, seasonId, leagueTeamId) {
    log.info(`Finding PoolUserTeams who picked leagueTeamId: ${leagueTeamId}`);

    const poolUserTeams = PoolUserTeams.find({ leagueId, seasonId, leagueTeamIds: leagueTeamId });
    poolUserTeams.forEach(function(poolUserTeam) {
      Modules.server.poolUserTeams.refreshPoolUserTeam(leagueId, seasonId, poolUserTeam);
    });
  },

  refreshPoolUserTeam(leagueId, seasonId, poolUserTeam) {
    log.info(`Refreshing PoolUserTeam: ${poolUserTeam._id}`);

    var totalWins = 0, totalGames = 0, totalPlusMinus = 0;
    poolUserTeam.leagueTeamIds.forEach(function(leagueTeamId) {
      const seasonLeagueTeams = SeasonLeagueTeams.findOne({ leagueId, seasonId, leagueTeamId });
      if (seasonLeagueTeams) {
        totalWins += seasonLeagueTeams.wins;
        totalGames += seasonLeagueTeams.totalGames();
        totalPlusMinus += seasonLeagueTeams.pointsFor - seasonLeagueTeams.pointsAgainst;
      }
    });

    const numberAffected = PoolUserTeams.update({ _id: poolUserTeam._id },
      { $set: { totalWins, totalGames, totalPlusMinus } } );
    log.info(`PoolUserTeams.update numberAffected: ${numberAffected}`);
  }
};
