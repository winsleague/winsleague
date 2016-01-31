describe('Seeds', () => {
  describe('createLeagues', () => {
    // Modules.server.seeds.createLeagues() is called in database_fixture.js before all specs are run

    it('should seed the Leagues', () => {
      expect(Leagues.find().count()).toBeGreaterThan(0);
    });

    it('should seed the League Teams', () => {
      expect(LeagueTeams.find().count()).toBeGreaterThan(0);
    });
  });
});
