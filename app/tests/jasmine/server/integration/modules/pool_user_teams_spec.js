let prettyjson = Meteor.npmRequire('prettyjson');

describe("Pool User Teams", function() {
  fdescribe("Refresh Team Stats", function () {
    afterEach(function () {
      log.info(`Cleaned up ${Games.remove({})} Games`);
      log.info(`Cleaned up ${Pools.remove({})} Pools`);
      log.info(`Cleaned up ${SeasonLeagueTeams.remove({})} SeasonLeagueTeams`);
    });

    it("should add up the wins and losses for all completed games", function () {
      const season = Modules.server.nflGameData.getSeason(2015);

      poolId = Pools.insert({
        leagueId: season.leagueId,
        seasonId: season._id,
        name: "Dummy"
      });
      

      const giantsTeamId = LeagueTeams.findOne({ abbreviation: "NYG" })._id;
      const seahawksTeamId = LeagueTeams.findOne({ abbreviation: "SEA" })._id;

      const poolUserTeamId = PoolUserTeams.insert({
        leagueId: season.leagueId,
        seasonId: season._id,
        poolId,
        userId: "dummy",
        userTeamName: "Dummy",
        leagueTeamIds: [giantsTeamId],
        pickNumbers: [1]
      });
      const poolUserTeam = PoolUserTeams.findOne({ _id: poolUserTeamId });

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

      Modules.server.poolUserTeams.refreshPoolUserTeam(season.leagueId, season._id, poolUserTeam);

      console.log(prettyjson.render(poolUserTeam));

      expect(poolUserTeam.totalWins).toBe(1)
    });
  });
});
