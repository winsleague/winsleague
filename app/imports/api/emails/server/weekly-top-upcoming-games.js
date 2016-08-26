import { Mailer } from 'meteor/lookback:emails';
import moment from 'moment';

import log from '../../../utils/log';

import RatingCalculator from '../../pool_game_interest_ratings/server/calculator';
import Common from './common';
import LeagueFinder from '../../leagues/finder';
import { Games } from '../../games/games';
import { Pools } from '../../pools/pools';
import { PoolGameInterestRatings } from '../../pool_game_interest_ratings/pool_game_interest_ratings';

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
    const endDate = moment().add(7, 'days').toDate();

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
    log.info(`Emailing top upcoming games email to pool ${pool._id} for season ${pool.latestSeasonId}`);

    const poolId = pool._id;
    const poolName = pool.name;
    const poolGameInterestRatings = PoolGameInterestRatings.find(
      {
        poolId: pool._id,
        rating: {
          $gte: 50,
        },
      },
      {
        sort: {
          rating: -1,
        },
        limit: 5,
      });

    const playerEmails = Common.getPlayerEmails(poolId, pool.latestSeasonId);

    const success = Mailer.send({
      to: playerEmails,
      subject: `Top Upcoming Games for ${poolName}`,
      template: 'weeklyTopUpcomingGamesTemplate',
      data: {
        poolId,
        poolName,
        poolGameInterestRatings,
      },
    });

    if (!success) {
      throwError(`Error sending Top Upcoming Games mail to ${poolName}`);
    }
  },
};
