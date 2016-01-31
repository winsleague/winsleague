Modules.seasons = {
  getByYear(league, year = (new Date()).getFullYear()) {
    return Seasons.findOne({ leagueId: league._id, year });
  },

  getLatest(league) {
    return Seasons.findOne({ leagueId: league._id }, { sort: ['year', 'desc'] });
  },
};
