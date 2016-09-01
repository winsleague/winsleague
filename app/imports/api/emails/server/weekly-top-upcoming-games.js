import { Mailer } from 'meteor/lookback:emails';

import log from '../../../utils/log';

import RatingCalculator from '../../pool_game_interest_ratings/server/calculator';
import Common from './common';
import { PoolGameInterestRatings } from '../../pool_game_interest_ratings/pool_game_interest_ratings';

export default {
  sendAll() {
    log.info('Sending out weekly top upcoming games email');

    RatingCalculator.calculateAllInterestRatings();

    RatingCalculator.nflPools().forEach(pool => {
      this.sendPoolEmail(pool);
    });
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

    if (poolGameInterestRatings.count() === 0) {
      log.info(`Not sending Games to Watch email to pool ${poolId} because there are no interest ratings.`);
      return;
    }

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
