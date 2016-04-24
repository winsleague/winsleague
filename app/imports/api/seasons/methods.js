import { Seasons } from './seasons';

export default {
  getByYear(league, year = (new Date()).getFullYear()) {
    return Seasons.findOne({ leagueId: league._id, year });
  },

  getLatestByLeague(league) {
    return Seasons.findOne(league._id, { sort: { year: -1 } });
  },

  getLatestByLeagueId(leagueId) {
    return Seasons.findOne({ leagueId }, { sort: { year: -1 } });
  },

  getLatestCursorByLeagueId(leagueId) {
    return Seasons.find({ leagueId }, { sort: { year: -1 }, limit: 1 });
  },
};
