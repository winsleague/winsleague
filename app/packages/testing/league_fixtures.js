function createDefaultLeagues() {
  let leagueId = Leagues.insert({ name: 'NFL' });
  log.debug(`Created NFL league: ${leagueId}`);
  LeagueTeams.insert({ leagueId, cityName: 'New York', mascotName: 'Giants',
    abbreviation: 'NYG', conference: 'NFC', division: 'East' });
  LeagueTeams.insert({ leagueId, cityName: 'Seattle', mascotName: 'Seahawks',
    abbreviation: 'SEA', conference: 'NFC', division: 'West' });
  Seasons.insert({ leagueId, year: 2015 });

  leagueId = Leagues.insert({ name: 'NBA' });
  log.debug(`Created NBA league: ${leagueId}`);
  LeagueTeams.insert({ leagueId, cityName: 'New York', mascotName: 'Knicks',
    abbreviation: 'NYK', conference: 'East', division: 'Atlantic' });
  LeagueTeams.insert({ leagueId, cityName: 'Seattle', mascotName: 'Supersonics',
    abbreviation: 'SEA', conference: 'West', division: 'Northwest' });
  Seasons.insert({ leagueId, year: 2015 });
}

Meteor.methods({
  'fixtures/leagues/createDefault': createDefaultLeagues,
});
