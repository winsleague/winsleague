Migrations.add({
  version: 3,
  name: 'Ingest data for the MLB 2015 season',
  up: () => {
    if (! Modules.environment.isProduction()) return; // only do this in production

    Modules.server.mlbGameData.ingestSeasonData();
  },
  down: () => {
    const league = Modules.leagues.getByName('MLB');
    const season = Modules.seasons.getLatestByLeague(league);
    Games.remove({ leagueId: league._id, seasonId: season._id });
    SeasonLeagueTeams.remove({ leagueId: league._id, seasonId: season._id });
  },
});

