Modules.server.seeds.mlb = {
  create() {
    Modules.server.seeds.mlb.createLeague();
    Modules.server.seeds.mlb.createTeams();
    Modules.server.seeds.mlb.createSeasons();
    Modules.server.seeds.mlb.createExpectedWins();
  },

  createLeague() {
    Modules.server.seeds.utils.removeLeague('MLB');

    Leagues.insert({
      name: 'MLB',
      seasonGameCount: 162,
    });
  },

  createTeams() {
    const leagueId = Modules.leagues.getIdByName('MLB');
    const teams = [
      {
        cityName: 'Atlanta', mascotName: 'Braves', abbreviation: 'ATL',
        conference: 'National', division: 'East',
      },
      {
        cityName: 'Arizona', mascotName: 'Diamondbacks', abbreviation: 'ARI',
        conference: 'National', division: 'West',
      },
      {
        cityName: 'Baltimore', mascotName: 'Orioles', abbreviation: 'BAL',
        conference: 'American', division: 'East',
      },
      {
        cityName: 'Boston', mascotName: 'Red Sox', abbreviation: 'BOS',
        conference: 'American', division: 'East',
      },
      {
        cityName: 'Chicago', mascotName: 'Cubs', abbreviation: 'CHC',
        conference: 'National', division: 'Central',
      },
      {
        cityName: 'Chicago', mascotName: 'White Sox', abbreviation: 'CWS',
        conference: 'American', division: 'Central',
      },
      {
        cityName: 'Cincinnati', mascotName: 'Reds', abbreviation: 'CIN',
        conference: 'National', division: 'Central',
      },
      {
        cityName: 'Cleveland', mascotName: 'Indians', abbreviation: 'CLE',
        conference: 'American', division: 'Central',
      },
      {
        cityName: 'Colorado', mascotName: 'Rockies', abbreviation: 'COL',
        conference: 'National', division: 'West',
      },
      {
        cityName: 'Detroit', mascotName: 'Tigers', abbreviation: 'DET',
        conference: 'American', division: 'Central',
      },
      {
        cityName: 'Houston', mascotName: 'Astros', abbreviation: 'HOU',
        conference: 'American', division: 'West',
      },
      {
        cityName: 'Kansas City', mascotName: 'Royals', abbreviation: 'KC',
        conference: 'American', division: 'Central',
      },
      {
        cityName: 'Los Angeles', mascotName: 'Angels', abbreviation: 'LAA',
        conference: 'American', division: 'West',
      },
      {
        cityName: 'Los Angeles', mascotName: 'Dodgers', abbreviation: 'LAD',
        conference: 'National', division: 'West',
      },
      {
        cityName: 'Miami', mascotName: 'Marlins', abbreviation: 'MIA',
        conference: 'National', division: 'East',
      },
      {
        cityName: 'Milwaukee', mascotName: 'Brewers', abbreviation: 'MIL',
        conference: 'National', division: 'Central',
      },
      {
        cityName: 'Minnesota', mascotName: 'Twins', abbreviation: 'MIN',
        conference: 'American', division: 'Central',
      },
      {
        cityName: 'New York', mascotName: 'Mets', abbreviation: 'NYM',
        conference: 'National', division: 'East',
      },
      {
        cityName: 'New York', mascotName: 'Yankees', abbreviation: 'NYY',
        conference: 'American', division: 'East',
      },
      {
        cityName: 'Oakland', mascotName: 'Athletics', abbreviation: 'OAK',
        conference: 'American', division: 'West',
      },
      {
        cityName: 'Philadelphia', mascotName: 'Phillies', abbreviation: 'PHI',
        conference: 'National', division: 'East',
      },
      {
        cityName: 'Pittsburgh', mascotName: 'Pirates', abbreviation: 'PIT',
        conference: 'National', division: 'East',
      },
      {
        cityName: 'San Diego', mascotName: 'Padres', abbreviation: 'SD',
        conference: 'National', division: 'West',
      },
      {
        cityName: 'Seattle', mascotName: 'Mariners', abbreviation: 'SEA',
        conference: 'American', division: 'West',
      },
      {
        cityName: 'San Francisco', mascotName: 'Giants', abbreviation: 'SF',
        conference: 'National', division: 'West',
      },
      {
        cityName: 'St. Louis', mascotName: 'Cardinals', abbreviation: 'STL',
        conference: 'National', division: 'Central',
      },
      {
        cityName: 'Tampa Bay', mascotName: 'Rays', abbreviation: 'TB',
        conference: 'American', division: 'East',
      },
      {
        cityName: 'Texas', mascotName: 'Rangers', abbreviation: 'TEX',
        conference: 'American', division: 'Central',
      },
      {
        cityName: 'Toronto', mascotName: 'Blue Jays', abbreviation: 'TOR',
        conference: 'American', division: 'East',
      },
      {
        cityName: 'Washington', mascotName: 'Nationals', abbreviation: 'WSH',
        conference: 'National', division: 'East',
      },
    ];
    for (const team of teams) {
      team.leagueId = leagueId;
      LeagueTeams.insert(team);
    }
  },

  createSeasons() {
    const leagueId = Modules.leagues.getIdByName('MLB');
    Seasons.insert({ leagueId, year: 2016,
      startDate: moment('2016-04-03').toDate(),
      endDate: moment('2016-10-02').toDate(),
    });
  },

  createExpectedWins() {
    const leagueId = Modules.leagues.getIdByName('MLB');
    const expectedWins = [
      98.91,
      97.00,
      95.64,
      94.82,
      92.82,
      91.73,
      90.36,
      89.45,
      88.82,
      88.18,
      86.73,
      85.45,
      84.36,
      83.27,
      82.18,
      81.00,
      79.64,
      78.45,
      77.27,
      75.91,
      74.82,
      74.00,
      73.55,
      71.45,
      70.36,
      68.45,
      67.27,
      65.64,
      63.36,
      58.82,
    ];
    expectedWins.forEach((element, index) => {
      LeaguePickExpectedWins.insert({ leagueId, rank: index + 1, wins: element });
    });
  },
};
