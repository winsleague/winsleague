describe('Pool Team Picks', () => {
  describe('updatePickQuality', () => {
    beforeEach(Package.testing.Fixtures.pools.createDefaultPool);
    beforeEach(Package.testing.Fixtures.poolTeams.createDefaultPoolTeam);

    it('should update the pick quality ', () => {
      const league = Modules.leagues.getByName('NFL');
      const season = Modules.seasons.getByYear(league, 2015);
      const leagueTeam = Modules.leagueTeams.getByName(league, 'New York', 'Giants');

      const seasonLeagueTeamId = SeasonLeagueTeams.insert({
        leagueId: league._id,
        seasonId: season._id,
        leagueTeamId: leagueTeam._id,
        wins: 13,
      });

      const poolTeamId = PoolTeams.findOne()._id;
      const poolTeamPickId = PoolTeamPicks.insert({
        poolTeamId,
        leagueTeamId: leagueTeam._id,
        pickNumber: 8,
      });

      let poolTeamPick = PoolTeamPicks.findOne(poolTeamPickId);

      Modules.server.poolTeamPicks.updatePickQuality(poolTeamPick);

      poolTeamPick = PoolTeamPicks.findOne(poolTeamPickId);
      log.debug('poolTeamPick:', poolTeamPick);

      expect(poolTeamPick.actualWins).toBe(13, 'actualWins');
      expect(poolTeamPick.expectedWins).toBe(10.38, 'expectedWins');
      expect(poolTeamPick.pickQuality.toFixed(1)).toBe('2.6', 'pickQuality'); // toFixed returns string
    });
  });
});
