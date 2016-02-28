describe('Pool Teams', () => {
  describe('Update Team Stats', () => {
    afterEach(() => {
      log.info(`Cleaned up ${Games.remove({})} Games`);
      log.info(`Cleaned up ${Pools.remove({})} Pools`);
      log.info(`Cleaned up ${SeasonLeagueTeams.remove({})} SeasonLeagueTeams`);
    });

    it('should add up the wins and losses for all completed games', () => {
      const league = Modules.leagues.getByName('NFL');
      const season = Modules.seasons.getByYear(league, 2015);

      // Creating a pool will automatically set commissioner to Meteor.userId
      const poolId = Pools.insert({
        leagueId: season.leagueId,
        seasonId: season._id,
        name: 'Dummy',
      });

      const giantsTeamId = LeagueTeams.findOne({ abbreviation: 'NYG' })._id;
      log.info(`giantsTeamId: ${giantsTeamId}`);
      const seahawksTeamId = LeagueTeams.findOne({ abbreviation: 'SEA' })._id;
      log.info(`seahawksTeamId: ${seahawksTeamId}`);

      const poolTeamId = PoolTeams.insert({
        poolId,
        userId: Meteor.userId(),
        userTeamName: 'Dummy',
      });

      PoolTeamPicks.insert({
        poolTeamId,
        leagueTeamId: giantsTeamId,
        pickNumber: 1,
      });

      Games.insert({
        leagueId: season.leagueId,
        seasonId: season._id,
        gameId: '1',
        gameDate: new Date(),
        homeTeamId: giantsTeamId,
        homeScore: 17,
        awayTeamId: seahawksTeamId,
        awayScore: 10,
        status: 'completed',
        period: 'final',
      });

      // Games.insert will automatically refresh all PoolTeams that are affected

      const poolTeam = PoolTeams.findOne({ _id: poolTeamId });
      log.debug('poolTeam:', poolTeam);

      expect(poolTeam.totalWins).toBe(1, 'totalWins');
      expect(poolTeam.totalGames).toBe(1, 'totalGames');
      expect(poolTeam.totalPlusMinus).toBe(7, 'totalPlusMinus');
    });
  });
});
