Modules.server.seeds = {
  createLeagues: () => {
    Leagues.remove({});
    LeagueTeams.remove({});
    Seasons.remove({});

    let nflId = Leagues.insert({ name: "NFL" });
    let league = Leagues.findOne({ _id: nflId });
    let teams = [
      { league: league, name: "Baltimore Ravens", abbreviation: "BAL", conference: "AFC", division: "North" },
      { league: league, name: "Cincinnati Bengals", abbreviation: "CIN", conference: "AFC", division: "North" },
      { league: league, name: "Cleveland Browns", abbreviation: "CLE", conference: "AFC", division: "North" },
      { league: league, name: "Pittsburgh Steelers", abbreviation: "PIT", conference: "AFC", division: "North" },
      { league: league, name: "Houston Texans", abbreviation: "HOU", conference: "AFC", division: "South" },
      { league: league, name: "Indianapolis Colts", abbreviation: "IND", conference: "AFC", division: "South" },
      { league: league, name: "Jacksonville Janguars", abbreviation: "JAC", conference: "AFC", division: "South" },
      { league: league, name: "Tennessee Titans", abbreviation: "TEN", conference: "AFC", division: "South" },
      { league: league, name: "Buffalo Bills", abbreviation: "BUF", conference: "AFC", division: "East" },
      { league: league, name: "Miami Dolphins", abbreviation: "MIA", conference: "AFC", division: "East" },
      { league: league, name: "New England Patriots", abbreviation: "NE", conference: "AFC", division: "East" },
      { league: league, name: "New York Jets", abbreviation: "NYJ", conference: "AFC", division: "East" },
      { league: league, name: "Denver Broncos", abbreviation: "DEN", conference: "AFC", division: "West" },
      { league: league, name: "Kansas City Chiefs", abbreviation: "KC", conference: "AFC", division: "West" },
      { league: league, name: "Oakland Raiders", abbreviation: "OAK", conference: "AFC", division: "West" },
      { league: league, name: "San Diego Chargers", abbreviation: "SD", conference: "AFC", division: "West" },
      { league: league, name: "Chicago Bears", abbreviation: "CHI", conference: "NFC", division: "North" },
      { league: league, name: "Detroit Lions", abbreviation: "DET", conference: "NFC", division: "North" },
      { league: league, name: "Green Bay Packers", abbreviation: "GB", conference: "NFC", division: "North" },
      { league: league, name: "Minnesota Vikings", abbreviation: "MIN", conference: "NFC", division: "North" },
      { league: league, name: "Atlanta Falcons", abbreviation: "ATL", conference: "NFC", division: "South" },
      { league: league, name: "Carolina Panthers", abbreviation: "CAR", conference: "NFC", division: "South" },
      { league: league, name: "New Orleans Saints", abbreviation: "NO", conference: "NFC", division: "South" },
      { league: league, name: "Tampa Bay Buccaneers", abbreviation: "TB", conference: "NFC", division: "South" },
      { league: league, name: "Dallas Cowboys", abbreviation: "DAL", conference: "NFC", division: "East" },
      { league: league, name: "New York Giants", abbreviation: "NYG", conference: "NFC", division: "East" },
      { league: league, name: "Philadelphia Eagles", abbreviation: "PHI", conference: "NFC", division: "East" },
      { league: league, name: "Washington Redskins", abbreviation: "WAS", conference: "NFC", division: "East" },
      { league: league, name: "Arizona Cardinals", abbreviation: "ARI", conference: "NFC", division: "West" },
      { league: league, name: "San Francisco 49ers", abbreviation: "SF", conference: "NFC", division: "West" },
      { league: league, name: "Seattle Seahawks", abbreviation: "SEA", conference: "NFC", division: "West" },
      { league: league, name: "St. Louis Rams", abbreviation: "STL", conference: "NFC", division: "West" }
    ];
    for (var team of teams) {
      LeagueTeams.insert(team);
    }

    Seasons.insert({ league: league, year: 2015 });
  }
};
