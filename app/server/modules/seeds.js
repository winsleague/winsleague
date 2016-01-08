Modules.server.seeds = {
  createLeagues: () => {
    Leagues.remove({});
    LeagueTeams.remove({});
    Seasons.remove({});

    let nflId = Leagues.insert({ name: "NFL" });
    let teams = [
      { cityName: "Baltimore", mascotName: "Ravens", abbreviation: "BAL", conference: "AFC", division: "North" },
      { cityName: "Cincinnati", mascotName: "Bengals", abbreviation: "CIN", conference: "AFC", division: "North" },
      { cityName: "Cleveland", mascotName: "Browns", abbreviation: "CLE", conference: "AFC", division: "North" },
      { cityName: "Pittsburgh", mascotName: "Steelers", abbreviation: "PIT", conference: "AFC", division: "North" },
      { cityName: "Houston", mascotName: "Texans", abbreviation: "HOU", conference: "AFC", division: "South" },
      { cityName: "Indianapolis", mascotName: "Colts", abbreviation: "IND", conference: "AFC", division: "South" },
      { cityName: "Jacksonville", mascotName: "Janguars", abbreviation: "JAC", conference: "AFC", division: "South" },
      { cityName: "Tennessee", mascotName: "Titans", abbreviation: "TEN", conference: "AFC", division: "South" },
      { cityName: "Buffalo", mascotName: "Bills", abbreviation: "BUF", conference: "AFC", division: "East" },
      { cityName: "Miami", mascotName: "Dolphins", abbreviation: "MIA", conference: "AFC", division: "East" },
      { cityName: "New England", mascotName: "Patriots", abbreviation: "NE", conference: "AFC", division: "East" },
      { cityName: "New York", mascotName: "Jets", abbreviation: "NYJ", conference: "AFC", division: "East" },
      { cityName: "Denver", mascotName: "Broncos", abbreviation: "DEN", conference: "AFC", division: "West" },
      { cityName: "Kansas City", mascotName: "Chiefs", abbreviation: "KC", conference: "AFC", division: "West" },
      { cityName: "Oakland", mascotName: "Raiders", abbreviation: "OAK", conference: "AFC", division: "West" },
      { cityName: "San Diego", mascotName: "Chargers", abbreviation: "SD", conference: "AFC", division: "West" },
      { cityName: "Chicago", mascotName: "Bears", abbreviation: "CHI", conference: "NFC", division: "North" },
      { cityName: "Detroit", mascotName: "Lions", abbreviation: "DET", conference: "NFC", division: "North" },
      { cityName: "Green Bay", mascotName: "Packers", abbreviation: "GB", conference: "NFC", division: "North" },
      { cityName: "Minnesota", mascotName: "Vikings", abbreviation: "MIN", conference: "NFC", division: "North" },
      { cityName: "Atlanta", mascotName: "Falcons", abbreviation: "ATL", conference: "NFC", division: "South" },
      { cityName: "Carolina", mascotName: "Panthers", abbreviation: "CAR", conference: "NFC", division: "South" },
      { cityName: "New Orleans", mascotName: "Saints", abbreviation: "NO", conference: "NFC", division: "South" },
      { cityName: "Tampa Bay", mascotName: "Buccaneers", abbreviation: "TB", conference: "NFC", division: "South" },
      { cityName: "Dallas", mascotName: "Cowboys", abbreviation: "DAL", conference: "NFC", division: "East" },
      { cityName: "New York", mascotName: "Giants", abbreviation: "NYG", conference: "NFC", division: "East" },
      { cityName: "Philadelphia", mascotName: "Eagles", abbreviation: "PHI", conference: "NFC", division: "East" },
      { cityName: "Washington", mascotName: "Redskins", abbreviation: "WAS", conference: "NFC", division: "East" },
      { cityName: "Arizona", mascotName: "Cardinals", abbreviation: "ARI", conference: "NFC", division: "West" },
      { cityName: "San Francisco", mascotName: "49ers", abbreviation: "SF", conference: "NFC", division: "West" },
      { cityName: "Seattle", mascotName: "Seahawks", abbreviation: "SEA", conference: "NFC", division: "West" },
      { cityName: "St. Louis", mascotName: "Rams", abbreviation: "STL", conference: "NFC", division: "West" }
    ];
    for (var team of teams) {
      team.leagueId = nflId;
      LeagueTeams.insert(team);
    }

    Seasons.insert({ leagueId: nflId, year: 2015 });
  }
};
