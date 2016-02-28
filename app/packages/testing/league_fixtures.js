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

  const expectedWins = [
    13.77,
    12.85,
    12.46,
    12.08,
    11.54,
    11.00,
    10.62,
    10.38,
    10.23,
    9.77,
    9.54,
    9.38,
    9.08,
    8.62,
    8.38,
    8.31,
    7.85,
    7.62,
    7.38,
    7.08,
    6.77,
    6.69,
    6.31,
    6.00,
    5.54,
    5.08,
    4.62,
    4.38,
    4.00,
    3.62,
    2.85,
    1.85,
  ];
  expectedWins.forEach((element, index) => {
    LeaguePickExpectedWins.insert({ leagueId, rank: index + 1, wins: element });
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
