import { Seasons } from './seasons';
import LeagueFinder from '../leagues/finder';

export default {
  getByYear(league, year = (new Date()).getFullYear()) {
    if (!league) {
      throw new Error('League is not found!');
    }

    let leagueId;
    if (typeof league === 'string') {
      leagueId = LeagueFinder.getIdByName(league);
    } else {
      leagueId = league._id;
    }

    return Seasons.findOne({ leagueId, year });
  },

  getLatestByLeague(league) {
    if (!league) {
      throw new Error('League is not found!');
    }

    return this.getLatestByLeagueId(league._id);
  },

  getLatestByLeagueId(leagueId) {
    if (!leagueId) {
      throw new Error('League is not found!');
    }

    return Seasons.findOne({ leagueId }, { sort: { year: -1 } });
  },

  getLatestByLeagueName(leagueName) {
    if (!leagueName) {
      throw new Error('League is not found!');
    }

    const leagueId = LeagueFinder.getIdByName(leagueName);
    return this.getLatestByLeagueId(leagueId);
  },

  getLatestCursorByLeagueId(leagueId) {
    if (!leagueId) {
      throw new Error('League is not found!');
    }

    return Seasons.find({ leagueId }, { sort: { year: -1 }, limit: 1 });
  },
};
