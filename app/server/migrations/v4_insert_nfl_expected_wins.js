Migrations.add({
  version: 4,
  name: 'Insert expected wins for NFL',
  up: () => {
    if (! Modules.environment.isProduction()) return; // only do this in production

    Modules.server.seeds.insertNflExpectedWins();
  },
  down: () => {
    const league = Modules.leagues.getByName('NFL');
    LeaguePickExpectedWins.remove({ leagueId: league._id });
  },
});

