import { Seasons } from './seasons';
import LeagueFinder from '../leagues/finder';

export default {
  getByYear(league, year = (new Date()).getFullYear()) {
    let leagueId;
    if (typeof league === 'string') {
      leagueId = LeagueFinder.getIdByName(league);
    } else {
      leagueId = league._id;
    }

    return Seasons.findOne({ leagueId, year });
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
