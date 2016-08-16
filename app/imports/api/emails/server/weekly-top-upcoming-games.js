import { Mailer } from 'meteor/lookback:emails';
import moment from 'moment';

import log from '../../../utils/log';

import RatingCalculator from '../../pool_game_interest_ratings/server/calculator';
import LeagueFinder from '../../leagues/finder';
import { Games } from '../../games/games';
import { Pools } from '../../pools/pools';
import { PoolTeamPicks } from '../../pool_team_picks/pool_team_picks';

export default {
  sendAll() {
    log.info('Sending out weekly top upcoming games email');

    this.calculateAllInterestRatings();

    this.nflPools().forEach(pool => {
      this.sendPoolEmail(pool);
    });
  },

  calculateAllInterestRatings() {
    this.nflPools().forEach(pool => {
      this.calculatePoolInterestRatings(pool);
    });
  },

  calculatePoolInterestRatings(pool) {
    this.upcomingGames().forEach(game => {
      RatingCalculator.calculate(pool, game);
    });
  },

  upcomingGames() {
    const leagueId = LeagueFinder.getIdByName('NFL');

    const startDate = moment().toDate();
    const endDate = moment().add(29, 'days').toDate();

    log.info(`Upcoming games from ${startDate} to ${endDate}`);

    return Games.find({
      leagueId,
      gameDate: {
        $gte: startDate,
        $lte: endDate,
      },
    });
  },

  nflPools() {
    const leagueId = LeagueFinder.getIdByName('NFL');

    return Pools.find({ leagueId });
  },

  sendPoolEmail(pool) {
    // look for top interest ratings
  }
};
