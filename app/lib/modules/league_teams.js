Modules.leagueTeams = {
  getLeagueTeam(league, cityName, mascotName) {
    return LeagueTeams.findOne({ leagueId: league._id, cityName, mascotName });
  },
};


