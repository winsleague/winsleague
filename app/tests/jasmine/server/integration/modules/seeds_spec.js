describe("Seeds", function() {
  describe("createLeagues", function() {
    // Modules.server.seeds.createLeagues() is called in database_fixture.js before all specs are run

    it ("should seed the Leagues", function () {
      expect(Leagues.find().count()).toBeGreaterThan(0);
    });

    it ("should seed the League Teams", function () {
      expect(LeagueTeams.find().count()).toBeGreaterThan(0);
    });
  });
});
