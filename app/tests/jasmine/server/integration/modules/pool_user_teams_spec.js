let prettyjson = Meteor.npmRequire('prettyjson');

describe("Pool User Teams", function() {
  describe("Refresh Team Stats", function () {
    afterEach(function () {
      log.info(`Cleaned up ${Games.remove({})} Games`);
      log.info(`Cleaned up ${Pools.remove({})} Pools`);
      log.info(`Cleaned up ${SeasonLeagueTeams.remove({})} SeasonLeagueTeams`);
    });

    it("should add up the wins and losses for all completed games", function () {
      const season = Modules.server.nflGameData.getSeason(2015);

      const user = Accounts.findUserByEmail("test@test.com");
      spyOn(Meteor, 'userId').and.returnValue(user._id);

      // Creating a pool will automatically set commissioner to Meteor.userId
      poolId = Pools.insert({
        leagueId: season.leagueId,
        seasonId: season._id,
        name: "Dummy"
      });

      const giantsTeamId = LeagueTeams.findOne({ abbreviation: "NYG" })._id;
      log.info(`giantsTeamId: ${giantsTeamId}`);
      const seahawksTeamId = LeagueTeams.findOne({ abbreviation: "SEA" })._id;
      log.info(`seahawksTeamId: ${seahawksTeamId}`);

      const poolUserTeamId = PoolUserTeams.insert({
        leagueId: season.leagueId,
        seasonId: season._id,
        poolId,
        userId: "dummy",
        userTeamName: "Dummy",
        leagueTeamIds: [giantsTeamId],
        pickNumbers: [1]
      });

      Games.insert( {
        leagueId: season.leagueId,
        seasonId: season._id,
        gameId: 1,
        gameDate: new Date(),
        homeTeamId: giantsTeamId,
        homeScore: 17,
        awayTeamId: seahawksTeamId,
        awayScore: 10,
        status: "completed",
        period: "final"
      } );

      // Games.insert will automatically refresh all PoolUserTeams that are affected

      const poolUserTeam = PoolUserTeams.findOne({ _id: poolUserTeamId });
      log.debug(prettyjson.render(poolUserTeam));

      expect(poolUserTeam.totalWins).toBe(1);
      expect(poolUserTeam.totalGames).toBe(1);
      expect(poolUserTeam.totalPlusMinus).toBe(7);
    });
  });
});
