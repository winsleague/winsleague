describe("NFL Game Data", function () {
  describe("Ingest Season Data", function () {
    it ("should ingest all games for the year", function () {
      const season = Modules.server.nflGameData.getSeason(2015);
      Modules.server.nflGameData.ingestSeasonData(season);
      expect(Games.find().count()).toBeGreaterThan(0);
    });
  });

  describe("Update Scores", function () {
    it ("should update the games based on live scores", function () {
      const season = Modules.server.nflGameData.getSeason(2015);
      Modules.server.nflGameData.ingestSeasonData(season);
      Modules.server.nflGameData.updateScores();
      expect(Games.find().count()).toBeGreaterThan(0);
    });
  });
});
