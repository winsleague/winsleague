Modules.seasons = {
  getByYear(league, year = (new Date()).getFullYear()) {
    return Seasons.findOne({ leagueId: league._id, year });
  },

  getLatestByLeague(league) {
    return Modules.seasons.getLatestByLeagueId(league._id);
  },

  getLatestByLeagueId(leagueId) {
    return Seasons.findOne({ leagueId }, { sort: { year: -1 } });
  },

  getLatestCursorByLeagueId(leagueId) {
    return Seasons.find({ leagueId }, { sort: { year: -1 }, limit: 1 });
  },
};
