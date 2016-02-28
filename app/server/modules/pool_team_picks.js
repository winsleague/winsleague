Modules.server.poolTeamPicks = {
  updatePickQuality(poolTeamPick) {
    // wins for team
    const seasonLeagueTeam = SeasonLeagueTeams.findOne({
      leagueId: poolTeamPick.leagueId,
      seasonId: poolTeamPick.seasonId,
      leagueTeamId: poolTeamPick.leagueTeamId,
    });
    const actualWins = _.get(seasonLeagueTeam, 'wins', 0);
    const expectedWins = LeaguePickExpectedWins.findOne({
      leagueId: poolTeamPick.leagueId,
      rank: poolTeamPick.pickNumber,
    }).wins;

    // TODO: expectedWins should account for how many games have been played
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
