describe("Season League Teams", function () {
  describe("Refresh Team Stats", function () {
    afterEach(function() {
      log.info(`Cleaned up ${Games.remove({})} Games`);
      log.info(`Cleaned up ${SeasonLeagueTeams.remove({})} SeasonLeagueTeams`);
    });

    it ("should add up the wins and losses for all completed games", function () {
      const season = Modules.server.nflGameData.getSeason(2015);

      homeLeagueTeam = LeagueTeams.findOne({ abbreviation: "NYG" });
      awayLeagueTeam = LeagueTeams.findOne({ abbreviation: "SEA" });

      Games.insert( {
        leagueId: season.leagueId,
        seasonId: season._id,
        gameId: 1,
        gameDate: new Date(),
        homeTeamId: homeLeagueTeam._id,
        homeScore: 17,
        awayTeamId: awayLeagueTeam._id,
        awayScore: 10,
        status: "completed",
        period: "final"
        } );

      Modules.server.seasonLeagueTeams.refreshTeamStats(season.leagueId, season._id, homeLeagueTeam._id);

      homeSeasonLeagueTeam = SeasonLeagueTeams.findOne({
        leagueId: season.leagueId,
        seasonId: season._id,
        leagueTeamId: homeLeagueTeam._id
      });
      expect(homeSeasonLeagueTeam.wins).toBe(1);
      expect(homeSeasonLeagueTeam.losses).toBe(0);
    });
  });
});
