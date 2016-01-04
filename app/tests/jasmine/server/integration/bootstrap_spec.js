describe("Bootstrap", function () {
  it ("should seed the Leagues", function () {
    expect(Leagues.find().count()).toBeGreaterThan(0);
  });

  it ("should seed the League Teams", function () {
    expect(LeagueTeams.find().count()).toBeGreaterThan(0);
  });
});
