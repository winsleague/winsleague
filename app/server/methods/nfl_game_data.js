Meteor.methods({
  'nfl_game_data/ingest/2014': () => {
    const league = Modules.leagues.getByName('NFL');
    let season = Modules.seasons.getByYear(league, 2014);
    if (!season) season = Seasons.insert({ leagueId: league._id, year: 2014 });
    Modules.server.nflGameData.ingestSeasonData(season);
  },
  'nfl_game_data/ingest/2015': () => {
    const league = Modules.leagues.getByName('NFL');
    let season = Modules.seasons.getByYear(league, 2015);
    if (!season) season = Seasons.insert({ leagueId: league._id, year: 2015 });
    Modules.server.nflGameData.ingestSeasonData(season);
  },
});
