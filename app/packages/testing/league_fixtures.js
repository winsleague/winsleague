function createDefaultLeagues() {
  let leagueId = Leagues.insert({ name: 'NFL' });
  log.debug(`Created NFL league: ${leagueId}`);
  LeagueTeams.insert({ leagueId, cityName: 'New York', mascotName: 'Giants',
    abbreviation: 'NYG', conference: 'NFC', division: 'East' });
  LeagueTeams.insert({ leagueId, cityName: 'Seattle', mascotName: 'Seahawks',
    abbreviation: 'SEA', conference: 'NFC', division: 'West' });
  Seasons.insert({ leagueId, year: 2015,
    startDate: moment('2015-09-10').toDate(),
    endDate: moment('2016-01-03').toDate(),
  });

  leagueId = Leagues.insert({ name: 'NBA' });
  log.debug(`Created NBA league: ${leagueId}`);
  LeagueTeams.insert({ leagueId, cityName: 'New York', mascotName: 'Knicks',
    abbreviation: 'NYK', conference: 'East', division: 'Atlantic' });
  LeagueTeams.insert({ leagueId, cityName: 'Seattle', mascotName: 'Supersonics',
    abbreviation: 'SEA', conference: 'West', division: 'Northwest' });
  Seasons.insert({ leagueId, year: 2015,
    startDate: moment('2015-10-10').toDate(),
    endDate: moment('2016-05-03').toDate(),
  });
}

Meteor.methods({
  'fixtures/leagues/createDefault': createDefaultLeagues,
});
