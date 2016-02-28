Modules.server.poolTeamPicks = {
  updatePickQuality(poolTeamPick) {
    // wins for team
    const actualWins = SeasonLeagueTeams.findOne({
      leagueId: poolTeamPick.leagueId,
      seasonId: poolTeamPick.seasonId,
      leagueTeamId: poolTeamPick.leagueTeamId,
    }).wins;
    const expectedWins = LeaguePickExpectedWins.findOne({
      leagueId: poolTeamPick.leagueId,
      rank: poolTeamPick.pickNumber,
    }).wins;

    const pickQuality = actualWins - expectedWins;

    log.info(`Updating PoolTeamPick:`, poolTeamPick, actualWins, expectedWins, pickQuality);

    PoolTeamPicks.direct.update(poolTeamPick._id, {
      $set: {
        actualWins,
        expectedWins,
        pickQuality,
      },
    });
  },
};
