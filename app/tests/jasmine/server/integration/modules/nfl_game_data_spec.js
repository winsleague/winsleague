describe("NFL Game Data", function () {
  beforeEach(function() {
    const season = Modules.server.nflGameData.getSeason(2015);
    const week = 3;
    Modules.server.nflGameData.ingestWeekData(season, week);
  });

  afterEach(function() {
    Games.remove({});
    SeasonLeagueTeams.remove({});
  });

  describe("Ingest Season Data", function () {
    it ("should ingest all games for the year", function () {
      expect(Games.find().count()).toBeGreaterThan(0);
    });
  });

  describe("Update Scores", function () {
    it ("should update the games based on live scores", function () {
      Modules.server.nflGameData.updateScores();
      expect(Games.find().count()).toBeGreaterThan(0);
    });
  });
});
