Modules.server.poolTeamPicks = {
  updatePickQuality(poolTeamPick) {
    // wins for team
    const seasonLeagueTeam = SeasonLeagueTeams.findOne({
      leagueId: poolTeamPick.leagueId,
      seasonId: poolTeamPick.seasonId,
      leagueTeamId: poolTeamPick.leagueTeamId,
    });
    const actualWins = _.get(seasonLeagueTeam, 'wins', 0);
    const gamesPlayed = (seasonLeagueTeam ? seasonLeagueTeam.totalGames() : 0);

    const expectedWinsFullSeason = LeaguePickExpectedWins.findOne({
      leagueId: poolTeamPick.leagueId,
      rank: poolTeamPick.pickNumber,
    }).wins;

    const seasonGameCount = Leagues.findOne(poolTeamPick.leagueId).seasonGameCount;

    const expectedWins = gamesPlayed / seasonGameCount * expectedWinsFullSeason;

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
