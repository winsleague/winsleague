Modules.seasons = {
  getLatest(league) {
    const leagueId = league._id;
    return Seasons.findOne({ leagueId }, { sort: ['year', 'desc'] });
  },
};
