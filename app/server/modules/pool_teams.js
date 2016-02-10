let prettyjson = Meteor.npmRequire('prettyjson');

Modules.server.poolTeams = {
  refreshWhoPickedLeagueTeam(leagueId, seasonId, leagueTeamId) {
    log.info(`Finding PoolTeams who picked leagueTeamId: ${leagueTeamId}`);

    const poolTeams = PoolTeams.find({ leagueId, seasonId, leagueTeamIds: leagueTeamId });
    poolTeams.forEach(poolTeam => {
      Modules.server.poolTeams.refreshPoolTeam(poolTeam);
    });

    log.info(`Done finding PoolTeams`);
  },

  refreshPoolTeam(poolTeam) {
    log.info(`Refreshing PoolTeam: ${poolTeam.userTeamName} - ${poolTeam._id}`);

    const seasonId = poolTeam.seasonId;
    let totalWins = 0;
    let totalLosses = 0;
    let totalGames = 0;
    let totalPlusMinus = 0;
    poolTeam.leagueTeamIds.forEach(leagueTeamId => {
      const seasonLeagueTeams = SeasonLeagueTeams.findOne({ seasonId, leagueTeamId });
      if (seasonLeagueTeams) {
        totalWins += seasonLeagueTeams.wins;
        totalLosses += seasonLeagueTeams.losses;
        totalGames += seasonLeagueTeams.totalGames();
        totalPlusMinus += seasonLeagueTeams.pointsFor - seasonLeagueTeams.pointsAgainst;
      }
    });

    // .direct is needed to avoid an infinite recursion loop
    // https://github.com/matb33/meteor-collection-hooks#direct-access-circumventing-hooks
    const numberAffected = PoolTeams.direct.update({ _id: poolTeam._id },
      { $set: { totalWins, totalLosses, totalGames, totalPlusMinus } });
    log.info(`PoolTeams.update numberAffected: ${numberAffected}`);
  },
};
