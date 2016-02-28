let prettyjson = Meteor.npmRequire('prettyjson');

Modules.server.poolTeams = {
  updateWhoPickedLeagueTeam(leagueId, seasonId, leagueTeamId) {
    log.info(`Finding PoolTeams who picked leagueTeamId: ${leagueTeamId}`);

    const poolTeams = PoolTeams.find({ leagueId, seasonId, leagueTeamIds: leagueTeamId });
    poolTeams.forEach(poolTeam => {
      Modules.server.poolTeams.updatePoolTeamWins(poolTeam);
      Modules.server.poolTeams.updatePoolTeamPickQuality(poolTeam);
    });

    log.debug(`Done finding PoolTeams who picked leagueTeamId`);
  },

  updatePoolTeamWins(poolTeam) {
    log.info(`Updating PoolTeam wins`, poolTeam);

    const seasonId = poolTeam.seasonId;
    let totalWins = 0;
    let totalLosses = 0;
    let totalGames = 0;
    let totalPlusMinus = 0;

    const picks = PoolTeamPicks.find({ poolTeamId: poolTeam._id });

    picks.forEach(poolTeamPick => {
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
    const numberAffected = PoolTeams.direct.update(poolTeam._id,
      { $set: { totalWins, totalLosses, totalGames, totalPlusMinus } });
    log.debug(`PoolTeams.update ${poolTeam._id} with totalWins: ${totalWins}, totalLosses: ${totalLosses}, numberAffected: ${numberAffected}`);
  },

  updatePoolTeamPickQuality(poolTeam) {
    PoolTeamPicks.find({ poolTeamId: poolTeam._id }).forEach(poolTeamPick => {
      Modules.server.poolTeamPicks.updatePickQuality(poolTeamPick);
    });
  },

  updatePicks(poolTeam) {
    log.info(`Updating picks for PoolTeam:`, poolTeam);

    const picks = PoolTeamPicks.find({ poolTeamId: poolTeam._id }, { sort: { pickNumber: 1 } });
    const leagueTeamIds = [];
    const pickNumbers = [];
    picks.forEach(poolTeamPick => {
      leagueTeamIds.push(poolTeamPick.leagueTeamId);
      pickNumbers.push(poolTeamPick.pickNumber);
    });

    const numberAffected = PoolTeams.direct.update(poolTeam._id,
      {
        $set: {
          leagueTeamIds,
          pickNumbers,
        },
      });
    log.debug(`PoolTeams.update ${poolTeam._id} with leagueTeamIds: ${leagueTeamIds}, pickNumbers: ${pickNumbers}, numberAffected: ${numberAffected}`);
  },
};
