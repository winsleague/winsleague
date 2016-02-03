Modules.leagueTeams = {
  getByName(league, cityName, mascotName) {
    return LeagueTeams.findOne({ leagueId: league._id, cityName, mascotName });
  },
};


