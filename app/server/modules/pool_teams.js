let prettyjson = Meteor.npmRequire( 'prettyjson' );

Modules.server.poolTeams = {
  refreshWhoPickedLeagueTeam(leagueId, seasonId, leagueTeamId) {
    log.info(`Finding PoolTeams who picked leagueTeamId: ${leagueTeamId}`);

    const poolTeams = PoolTeams.find({ leagueId, seasonId, leagueTeamIds: leagueTeamId });
    poolTeams.forEach(function(poolTeam) {
      Modules.server.poolTeams.refreshPoolTeam(leagueId, seasonId, poolTeam);
    });

    log.info(`Done finding PoolTeams`);
  },

  refreshPoolTeam(leagueId, seasonId, poolTeam) {
    log.info(`Refreshing PoolTeam: ${poolTeam.userTeamName} - ${poolTeam._id}`);

    var totalWins = 0, totalGames = 0, totalPlusMinus = 0;
    poolTeam.leagueTeamIds.forEach(function(leagueTeamId) {
      const seasonLeagueTeams = SeasonLeagueTeams.findOne({ leagueId, seasonId, leagueTeamId });
      if (seasonLeagueTeams) {
        totalWins += seasonLeagueTeams.wins;
        totalGames += seasonLeagueTeams.totalGames();
        totalPlusMinus += seasonLeagueTeams.pointsFor - seasonLeagueTeams.pointsAgainst;
      }
    });

    const numberAffected = PoolTeams.update({ _id: poolTeam._id },
      { $set: { totalWins, totalGames, totalPlusMinus } } );
    log.info(`PoolTeams.update numberAffected: ${numberAffected}`);
  }
};
