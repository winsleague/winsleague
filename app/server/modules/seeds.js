Modules.server.seeds = {
  createLeagues: () => {
    Leagues.remove({});
    LeagueTeams.remove({});
    Seasons.remove({});

    let nflId = Leagues.insert({ name: "NFL" });
    let teams = [
      { leagueId: nflId, name: "Baltimore Ravens", abbreviation: "BAL", conference: "AFC", division: "North" },
      { leagueId: nflId, name: "Cincinnati Bengals", abbreviation: "CIN", conference: "AFC", division: "North" },
      { leagueId: nflId, name: "Cleveland Browns", abbreviation: "CLE", conference: "AFC", division: "North" },
      { leagueId: nflId, name: "Pittsburgh Steelers", abbreviation: "PIT", conference: "AFC", division: "North" },
      { leagueId: nflId, name: "Houston Texans", abbreviation: "HOU", conference: "AFC", division: "South" },
      { leagueId: nflId, name: "Indianapolis Colts", abbreviation: "IND", conference: "AFC", division: "South" },
      { leagueId: nflId, name: "Jacksonville Janguars", abbreviation: "JAC", conference: "AFC", division: "South" },
      { leagueId: nflId, name: "Tennessee Titans", abbreviation: "TEN", conference: "AFC", division: "South" },
      { leagueId: nflId, name: "Buffalo Bills", abbreviation: "BUF", conference: "AFC", division: "East" },
      { leagueId: nflId, name: "Miami Dolphins", abbreviation: "MIA", conference: "AFC", division: "East" },
      { leagueId: nflId, name: "New England Patriots", abbreviation: "NE", conference: "AFC", division: "East" },
      { leagueId: nflId, name: "New York Jets", abbreviation: "NYJ", conference: "AFC", division: "East" },
      { leagueId: nflId, name: "Denver Broncos", abbreviation: "DEN", conference: "AFC", division: "West" },
      { leagueId: nflId, name: "Kansas City Chiefs", abbreviation: "KC", conference: "AFC", division: "West" },
      { leagueId: nflId, name: "Oakland Raiders", abbreviation: "OAK", conference: "AFC", division: "West" },
      { leagueId: nflId, name: "San Diego Chargers", abbreviation: "SD", conference: "AFC", division: "West" },
      { leagueId: nflId, name: "Chicago Bears", abbreviation: "CHI", conference: "NFC", division: "North" },
      { leagueId: nflId, name: "Detroit Lions", abbreviation: "DET", conference: "NFC", division: "North" },
      { leagueId: nflId, name: "Green Bay Packers", abbreviation: "GB", conference: "NFC", division: "North" },
      { leagueId: nflId, name: "Minnesota Vikings", abbreviation: "MIN", conference: "NFC", division: "North" },
      { leagueId: nflId, name: "Atlanta Falcons", abbreviation: "ATL", conference: "NFC", division: "South" },
      { leagueId: nflId, name: "Carolina Panthers", abbreviation: "CAR", conference: "NFC", division: "South" },
      { leagueId: nflId, name: "New Orleans Saints", abbreviation: "NO", conference: "NFC", division: "South" },
      { leagueId: nflId, name: "Tampa Bay Buccaneers", abbreviation: "TB", conference: "NFC", division: "South" },
      { leagueId: nflId, name: "Dallas Cowboys", abbreviation: "DAL", conference: "NFC", division: "East" },
      { leagueId: nflId, name: "New York Giants", abbreviation: "NYG", conference: "NFC", division: "East" },
      { leagueId: nflId, name: "Philadelphia Eagles", abbreviation: "PHI", conference: "NFC", division: "East" },
      { leagueId: nflId, name: "Washington Redskins", abbreviation: "WAS", conference: "NFC", division: "East" },
      { leagueId: nflId, name: "Arizona Cardinals", abbreviation: "ARI", conference: "NFC", division: "West" },
      { leagueId: nflId, name: "San Francisco 49ers", abbreviation: "SF", conference: "NFC", division: "West" },
      { leagueId: nflId, name: "Seattle Seahawks", abbreviation: "SEA", conference: "NFC", division: "West" },
      { leagueId: nflId, name: "St. Louis Rams", abbreviation: "STL", conference: "NFC", division: "West" }
    ];
    for (var team of teams) {
      LeagueTeams.insert(team);
    }

    Seasons.insert({ leagueId: nflId, year: 2015 });
  }
};
