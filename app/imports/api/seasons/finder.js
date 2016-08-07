import { Seasons } from './seasons';
import LeagueFinder from '../leagues/finder';

export default {
  getByYear(league, year = (new Date()).getFullYear()) {
    return Seasons.findOne({ leagueId: league._id, year });
  },

  getLatestByLeague(league) {
    return this.getLatestByLeagueId(league._id);
  },

  getLatestByLeagueId(leagueId) {
    return Seasons.findOne({ leagueId }, { sort: { year: -1 } });
  },

  getLatestByLeagueName(leagueName) {
    const leagueId = LeagueFinder.getIdByName(leagueName);
    return this.getLatestByLeagueId(leagueId);
  },

  getLatestCursorByLeagueId(leagueId) {
    return Seasons.find({ leagueId }, { sort: { year: -1 }, limit: 1 });
  },
};
