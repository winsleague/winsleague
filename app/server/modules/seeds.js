Modules.server.seeds = {
  createLeagues: () => {
    Leagues.remove({});
    LeagueTeams.remove({});
    Seasons.remove({});

    let nflId = Leagues.insert({ name: "NFL" });
    let teams = [
      { league: nflId, name: "New York Giants", abbreviation: "NYG", conference: "NFC", division: "East" },
      { league: nflId, name: "Seattle Seahawks", abbreviation: "SEA", conference: "NFC", division: "West" }
    ];
    for (var team of teams) {
      LeagueTeams.insert(team);
    }

    Seasons.insert({ league: nflId, year: 2015 });
  }
};
