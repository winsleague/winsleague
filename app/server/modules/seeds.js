Modules.server.seeds = {
  createLeagues() {
    log.info(`Creating leagues and teams`);

    Modules.server.seeds.createNflLeague();
    Modules.server.seeds.createNbaLeague();
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
      { cityName: 'Jacksonville', mascotName: 'Janguars', abbreviation: 'JAC', conference: 'AFC', division: 'South' },
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

    Seasons.insert({ leagueId, year: 2014 });
    Seasons.insert({ leagueId, year: 2015 });
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

    Seasons.insert({ leagueId, year: 2015 });
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
