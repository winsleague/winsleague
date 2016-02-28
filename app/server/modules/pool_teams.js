Modules.server.poolTeams = {
  updateWhoPickedLeagueTeam(leagueTeamId) {
    log.info(`Finding PoolTeams who picked leagueTeamId: ${leagueTeamId}`);

    const poolTeamPicks = PoolTeamPicks.find({ leagueTeamId });
    poolTeamPicks.forEach(poolTeamPick => {
      Modules.server.poolTeams.updatePoolTeamWins(poolTeamPick.poolTeamId);
      Modules.server.poolTeams.updatePoolTeamPickQuality(poolTeamPick.poolTeamId);
    });

    log.debug(`Done finding PoolTeams who picked leagueTeamId`);
  },

  updatePoolTeamWins(poolTeamId) {
    log.info(`Updating PoolTeam wins`, poolTeamId);

    let totalWins = 0;
    let totalLosses = 0;
    let totalGames = 0;
    let totalPlusMinus = 0;

    const picks = PoolTeamPicks.find({ poolTeamId });

    picks.forEach(poolTeamPick => {
      const seasonId = poolTeamPick.seasonId;
      const leagueTeamId = poolTeamPick.leagueTeamId;
      const seasonLeagueTeam = SeasonLeagueTeams.findOne({ seasonId, leagueTeamId });
      log.debug(`Found seasonLeagueTeam`, seasonLeagueTeam);
      if (seasonLeagueTeam) {
        totalWins += seasonLeagueTeam.wins;
        totalLosses += seasonLeagueTeam.losses;
        totalGames += seasonLeagueTeam.totalGames();
        totalPlusMinus += seasonLeagueTeam.pointsFor - seasonLeagueTeam.pointsAgainst;
      }
    });

    // .direct is needed to avoid an infinite recursion loop
    // https://github.com/matb33/meteor-collection-hooks#direct-access-circumventing-hooks
    const numberAffected = PoolTeams.direct.update(poolTeamId,
      { $set: { totalWins, totalLosses, totalGames, totalPlusMinus } });
    log.debug(`PoolTeams.update ${poolTeamId} with totalWins: ${totalWins}, totalLosses: ${totalLosses}, numberAffected: ${numberAffected}`);
  },

  updatePoolTeamPickQuality(poolTeamId) {
    PoolTeamPicks.find({ poolTeamId }).forEach(poolTeamPick => {
      Modules.server.poolTeamPicks.updatePickQuality(poolTeamPick);
    });
  },

  updateTeamSummary(poolTeamId) {
    log.info(`Updating team summary for PoolTeam:`, poolTeamId);

    let teamSummary = '';
    const picks = PoolTeamPicks.find({ poolTeamId }, { sort: { pickNumber: 1 } });
    picks.forEach(poolTeamPick => {
      const leagueTeam = LeagueTeams.findOne(poolTeamPick.leagueTeamId);
      teamSummary += `${leagueTeam.abbreviation} #${poolTeamPick.pickNumber}, `;
    });
    if (teamSummary.length > 0) {
      teamSummary = teamSummary.substr(0, teamSummary.length - 2);
    } else {
      teamSummary = 'No teams drafted!';
    }

    const numberAffected = PoolTeams.direct.update(poolTeamId,
      {
        $set: {
          teamSummary,
        },
      });
    log.debug(`PoolTeams.update ${poolTeamId} with teamSummary: ${teamSummary}, numberAffected: ${numberAffected}`);
  },
};
