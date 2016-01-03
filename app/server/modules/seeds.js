Modules.server.seeds = {
  createLeagues: () => {
    let nflId = Leagues.insert({ name: "NFL" });
    LeagueTeams.insert({ league: nflId, name: "New York Giants", abbreviation: "NYG" });
    LeagueTeams.insert({ league: nflId, name: "Seattle Seahawks", abbreviation: "SEA" });
  }
};
