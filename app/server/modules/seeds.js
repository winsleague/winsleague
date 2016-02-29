Modules.server.seeds = {
  initializeLeagues() {
    log.info(`Initializing leagues and teams`);

    if (! Modules.leagues.getByName('NFL')) Modules.server.seeds.createNflLeague();
    if (! Modules.leagues.getByName('NBA')) Modules.server.seeds.createNbaLeague();
    if (! Modules.leagues.getByName('MLB')) Modules.server.seeds.createMlbLeague();
  },

  createNflLeague() {
    Modules.server.seeds.removeLeague('NFL');

    const leagueId = Leagues.insert({ name: 'NFL' });
    const teams = [
      { cityName: 'Baltimore', mascotName: 'Ravens', abbreviation: 'BAL', conference: 'AFC', division: 'North' },
      { cityName: 'Cincinnati', mascotName: 'Bengals', abbreviation: 'CIN', conference: 'AFC', division: 'North' },
      { cityName: 'Cleveland', mascotName: 'Browns', abbreviation: 'CLE', conference: 'AFC', division: 'North' },
      { cityName: 'Pittsburgh', mascotName: 'Steelers', abbreviation: 'PIT', conference: 'AFC', division: 'North' },
      { cityName: 'Houston', mascotName: 'Texans', abbreviation: 'HOU', conference: 'AFC', division: 'South' },
      { cityName: 'Indianapolis', mascotName: 'Colts', abbreviation: 'IND', conference: 'AFC', division: 'South' },
      { cityName: 'Jacksonville', mascotName: 'Jaguars', abbreviation: 'JAC', conference: 'AFC', division: 'South' },
      { cityName: 'Tennessee', mascotName: 'Titans', abbreviation: 'TEN', conference: 'AFC', division: 'South' },
      { cityName: 'Buffalo', mascotName: 'Bills', abbreviation: 'BUF', conference: 'AFC', division: 'East' },
      { cityName: 'Miami', mascotName: 'Dolphins', abbreviation: 'MIA', conference: 'AFC', division: 'East' },
      { cityName: 'New England', mascotName: 'Patriots', abbreviation: 'NE', conference: 'AFC', division: 'East' },
      { cityName: 'New York', mascotName: 'Jets', abbreviation: 'NYJ', conference: 'AFC', division: 'East' },
      { cityName: 'Denver', mascotName: 'Broncos', abbreviation: 'DEN', conference: 'AFC', division: 'West' },
      { cityName: 'Kansas City', mascotName: 'Chiefs', abbreviation: 'KC', conference: 'AFC', division: 'West' },
      { cityName: 'Oakland', mascotName: 'Raiders', abbreviation: 'OAK', conference: 'AFC', division: 'West' },
      { cityName: 'San Diego', mascotName: 'Chargers', abbreviation: 'SD', conference: 'AFC', division: 'West' },
      { cityName: 'Chicago', mascotName: 'Bears', abbreviation: 'CHI', conference: 'NFC', division: 'North' },
      { cityName: 'Detroit', mascotName: 'Lions', abbreviation: 'DET', conference: 'NFC', division: 'North' },
      { cityName: 'Green Bay', mascotName: 'Packers', abbreviation: 'GB', conference: 'NFC', division: 'North' },
      { cityName: 'Minnesota', mascotName: 'Vikings', abbreviation: 'MIN', conference: 'NFC', division: 'North' },
      { cityName: 'Atlanta', mascotName: 'Falcons', abbreviation: 'ATL', conference: 'NFC', division: 'South' },
      { cityName: 'Carolina', mascotName: 'Panthers', abbreviation: 'CAR', conference: 'NFC', division: 'South' },
      { cityName: 'New Orleans', mascotName: 'Saints', abbreviation: 'NO', conference: 'NFC', division: 'South' },
      { cityName: 'Tampa Bay', mascotName: 'Buccaneers', abbreviation: 'TB', conference: 'NFC', division: 'South' },
      { cityName: 'Dallas', mascotName: 'Cowboys', abbreviation: 'DAL', conference: 'NFC', division: 'East' },
      { cityName: 'New York', mascotName: 'Giants', abbreviation: 'NYG', conference: 'NFC', division: 'East' },
      { cityName: 'Philadelphia', mascotName: 'Eagles', abbreviation: 'PHI', conference: 'NFC', division: 'East' },
      { cityName: 'Washington', mascotName: 'Redskins', abbreviation: 'WAS', conference: 'NFC', division: 'East' },
      { cityName: 'Arizona', mascotName: 'Cardinals', abbreviation: 'ARI', conference: 'NFC', division: 'West' },
      { cityName: 'San Francisco', mascotName: '49ers', abbreviation: 'SF', conference: 'NFC', division: 'West' },
      { cityName: 'Seattle', mascotName: 'Seahawks', abbreviation: 'SEA', conference: 'NFC', division: 'West' },
      { cityName: 'St. Louis', mascotName: 'Rams', abbreviation: 'STL', conference: 'NFC', division: 'West' },
    ];
    for (const team of teams) {
      team.leagueId = leagueId;
      LeagueTeams.insert(team);
    }

    Seasons.insert({ leagueId, year: 2014,
      startDate: moment('2014-09-04').toDate(),
      endDate: moment('2015-12-28').toDate(),
    });
    Seasons.insert({ leagueId, year: 2015,
      startDate: moment('2015-09-10').toDate(),
      endDate: moment('2016-01-03').toDate(),
    });

    Modules.server.seeds.insertNflExpectedWins();
  },

  insertNflExpectedWins() {
    const leagueId = Modules.leagues.getByName('NFL')._id;
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
  },

  createNbaLeague() {
    Modules.server.seeds.removeLeague('NBA');

    const leagueId = Leagues.insert({ name: 'NBA' });
    const teams = [
      { cityName: 'Atlanta', mascotName: 'Hawks', abbreviation: 'ATL', conference: 'East', division: 'Southeast' },
      { cityName: 'Boston', mascotName: 'Celtics', abbreviation: 'BOS', conference: 'East', division: 'Atlantic' },
      { cityName: 'Brooklyn', mascotName: 'Nets', abbreviation: 'BKN', conference: 'East', division: 'Atlantic' },
      { cityName: 'Charlotte', mascotName: 'Hornets', abbreviation: 'CHA', conference: 'East', division: 'Southeast' },
      { cityName: 'Chicago', mascotName: 'Bulls', abbreviation: 'CHI', conference: 'East', division: 'Central' },
      { cityName: 'Cleveland', mascotName: 'Cavaliers', abbreviation: 'CLE', conference: 'East', division: 'Central' },
      { cityName: 'Dallas', mascotName: 'Mavericks', abbreviation: 'DAL', conference: 'West', division: 'Southwest' },
      { cityName: 'Denver', mascotName: 'Nuggets', abbreviation: 'DEN', conference: 'West', division: 'Northwest' },
      { cityName: 'Detroit', mascotName: 'Pistons', abbreviation: 'DET', conference: 'East', division: 'Central' },
      { cityName: 'Golden State', mascotName: 'Warriors', abbreviation: 'GS', conference: 'West', division: 'Pacific' },
      { cityName: 'Houston', mascotName: 'Rockets', abbreviation: 'HOU', conference: 'West', division: 'Southwest' },
      { cityName: 'Indiana', mascotName: 'Pacers', abbreviation: 'IND', conference: 'East', division: 'Central' },
      { cityName: 'Los Angeles', mascotName: 'Clippers', abbreviation: 'LAC', conference: 'West', division: 'Pacific' },
      { cityName: 'Los Angeles', mascotName: 'Lakers', abbreviation: 'LAL', conference: 'West', division: 'Pacific' },
      { cityName: 'Memphis', mascotName: 'Grizzlies', abbreviation: 'MEM', conference: 'West', division: 'Southwest' },
      { cityName: 'Miami', mascotName: 'Heat', abbreviation: 'MIA', conference: 'East', division: 'Southeast' },
      { cityName: 'Milwaukee', mascotName: 'Bucks', abbreviation: 'MIL', conference: 'East', division: 'Central' },
      { cityName: 'Minnesota', mascotName: 'Timberwolves', abbreviation: 'MIN', conference: 'West', division: 'Northwest' },
      { cityName: 'New Orleans', mascotName: 'Pelicans', abbreviation: 'NO', conference: 'West', division: 'Southwest' },
      { cityName: 'New York', mascotName: 'Knicks', abbreviation: 'NY', conference: 'East', division: 'Atlantic' },
      { cityName: 'Oklahoma City', mascotName: 'Thunder', abbreviation: 'OKC', conference: 'West', division: 'Northwest' },
      { cityName: 'Orlando', mascotName: 'Magic', abbreviation: 'ORL', conference: 'East', division: 'Southeast' },
      { cityName: 'Philadelphia', mascotName: '76ers', abbreviation: 'PHI', conference: 'East', division: 'Atlantic' },
      { cityName: 'Phoenix', mascotName: 'Suns', abbreviation: 'PHO', conference: 'West', division: 'Pacific' },
      { cityName: 'Portland', mascotName: 'Trail Blazers', abbreviation: 'POR', conference: 'West', division: 'Northwest' },
      { cityName: 'Sacramento', mascotName: 'Kings', abbreviation: 'SAC', conference: 'West', division: 'Pacific' },
      { cityName: 'San Antonio', mascotName: 'Spurs', abbreviation: 'SA', conference: 'West', division: 'Southwest' },
      { cityName: 'Toronto', mascotName: 'Raptors', abbreviation: 'TOR', conference: 'East', division: 'Atlantic' },
      { cityName: 'Utah', mascotName: 'Jazz', abbreviation: 'UTA', conference: 'West', division: 'Northwest' },
      { cityName: 'Washington', mascotName: 'Wizards', abbreviation: 'WAS', conference: 'East', division: 'Southeast' },
    ];
    for (const team of teams) {
      team.leagueId = leagueId;
      LeagueTeams.insert(team);
    }

    Seasons.insert({ leagueId, year: 2015,
      startDate: moment('2015-10-27').toDate(),
      endDate: moment('2016-04-13').toDate(),
    });

    Modules.server.seeds.insertNbaExpectedWins();
  },

  insertNbaExpectedWins() {
    const leagueId = Modules.leagues.getByName('NBA')._id;
    const expectedWins = [
      63.10,
      59.70,
      57.00,
      54.90,
      53.20,
      52.50,
      51.80,
      50.10,
      48.50,
      47.30,
      46.20,
      45.30,
      44.00,
      42.60,
      41.40,
      40.50,
      39.40,
      37.70,
      36.20,
      35.00,
      33.30,
      31.80,
      30.50,
      28.70,
      26.90,
      25.40,
      24.20,
      22.80,
      19.70,
      16.20,
    ];
    expectedWins.forEach((element, index) => {
      LeaguePickExpectedWins.insert({ leagueId, rank: index + 1, wins: element });
    });
  },

  createMlbLeague() {
    Modules.server.seeds.removeLeague('MLB');

    const leagueId = Leagues.insert({ name: 'MLB' });
    const teams = [
      { cityName: 'Atlanta', mascotName: 'Braves', abbreviation: 'ATL', conference: 'National', division: 'East' },
      { cityName: 'Arizona', mascotName: 'Diamondbacks', abbreviation: 'ARI', conference: 'National', division: 'West' },
      { cityName: 'Baltimore', mascotName: 'Orioles', abbreviation: 'BAL', conference: 'American', division: 'East' },
      { cityName: 'Boston', mascotName: 'Red Sox', abbreviation: 'BOS', conference: 'American', division: 'East' },
      { cityName: 'Chicago', mascotName: 'Cubs', abbreviation: 'CHC', conference: 'National', division: 'Central' },
      { cityName: 'Chicago', mascotName: 'White Sox', abbreviation: 'CWS', conference: 'American', division: 'Central' },
      { cityName: 'Cincinnati', mascotName: 'Reds', abbreviation: 'CIN', conference: 'National', division: 'Central' },
      { cityName: 'Cleveland', mascotName: 'Indians', abbreviation: 'CLE', conference: 'American', division: 'Central' },
      { cityName: 'Colorado', mascotName: 'Rockies', abbreviation: 'COL', conference: 'National', division: 'West' },
      { cityName: 'Detroit', mascotName: 'Tigers', abbreviation: 'DET', conference: 'American', division: 'Central' },
      { cityName: 'Houston', mascotName: 'Astros', abbreviation: 'HOU', conference: 'American', division: 'West' },
      { cityName: 'Kansas City', mascotName: 'Royals', abbreviation: 'KC', conference: 'American', division: 'Central' },
      { cityName: 'Los Angeles', mascotName: 'Angels', abbreviation: 'LAA', conference: 'American', division: 'West' },
      { cityName: 'Los Angeles', mascotName: 'Dodgers', abbreviation: 'LAD', conference: 'National', division: 'West' },
      { cityName: 'Miami', mascotName: 'Marlins', abbreviation: 'MIA', conference: 'National', division: 'East' },
      { cityName: 'Milwaukee', mascotName: 'Brewers', abbreviation: 'MIL', conference: 'National', division: 'Central' },
      { cityName: 'Minnesota', mascotName: 'Twins', abbreviation: 'MIN', conference: 'American', division: 'Central' },
      { cityName: 'New York', mascotName: 'Mets', abbreviation: 'NYM', conference: 'National', division: 'East' },
      { cityName: 'New York', mascotName: 'Yankees', abbreviation: 'NYY', conference: 'American', division: 'East' },
      { cityName: 'Oakland', mascotName: 'Athletics', abbreviation: 'OAK', conference: 'American', division: 'West' },
      { cityName: 'Philadelphia', mascotName: 'Phillies', abbreviation: 'PHI', conference: 'National', division: 'East' },
      { cityName: 'Pittsburgh', mascotName: 'Pirates', abbreviation: 'PIT', conference: 'National', division: 'East' },
      { cityName: 'San Diego', mascotName: 'Padres', abbreviation: 'SD', conference: 'National', division: 'West' },
      { cityName: 'Seattle', mascotName: 'Mariners', abbreviation: 'SEA', conference: 'American', division: 'West' },
      { cityName: 'San Francisco', mascotName: 'Giants', abbreviation: 'SF', conference: 'National', division: 'West' },
      { cityName: 'St. Louis', mascotName: 'Cardinals', abbreviation: 'STL', conference: 'National', division: 'Central' },
      { cityName: 'Tampa Bay', mascotName: 'Rays', abbreviation: 'TB', conference: 'American', division: 'East' },
      { cityName: 'Texas', mascotName: 'Rangers', abbreviation: 'TEX', conference: 'American', division: 'Central' },
      { cityName: 'Toronto', mascotName: 'Blue Jays', abbreviation: 'TOR', conference: 'American', division: 'East' },
      { cityName: 'Washington', mascotName: 'Nationals', abbreviation: 'WSH', conference: 'National', division: 'East' },
    ];
    for (const team of teams) {
      team.leagueId = leagueId;
      LeagueTeams.insert(team);
    }

    Seasons.insert({ leagueId, year: 2016,
      startDate: moment('2016-04-03').toDate(),
      endDate: moment('2016-10-02').toDate(),
    });

    Modules.server.seeds.insertMlbExpectedWins();
  },

  insertMlbExpectedWins() {
    const leagueId = Modules.leagues.getByName('MLB')._id;
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

  removeLeague(leagueName) {
    const league = Modules.leagues.getByName(leagueName);
    if (!league) return;
    const leagueId = league._id;
    Games.remove({ leagueId });
    LeagueTeams.remove({ leagueId });
    PoolTeams.remove({ leagueId });
    Pools.remove({ leagueId });
    SeasonLeagueTeams.remove({ leagueId });
    Seasons.remove({ leagueId });
    Leagues.remove({ _id: leagueId });
  },
};
