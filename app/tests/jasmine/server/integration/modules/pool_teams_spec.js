let prettyjson = Meteor.npmRequire('prettyjson');

describe("Pool Teams", function() {
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

      const poolTeamId = PoolTeams.insert({
        poolId,
        userId: Meteor.userId(),
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

      // Games.insert will automatically refresh all PoolTeams that are affected

      const poolTeam = PoolTeams.findOne({ _id: poolTeamId });
      log.debug(prettyjson.render(poolTeam));

      expect(poolTeam.totalWins).toBe(1);
      expect(poolTeam.totalGames).toBe(1);
      expect(poolTeam.totalPlusMinus).toBe(7);
    });
  });
});
