import { Mailer } from 'meteor/lookback:emails';

import log from '../../../utils/log';

import RatingCalculator from '../../pool_game_interest_ratings/server/calculator';
import Common from './common';
import { Pools } from '../../pools/pools';
import { PoolGameInterestRatings } from '../../pool_game_interest_ratings/pool_game_interest_ratings';

export default {
  sendAll() {
    log.info('Sending out weekly games to watch email');

    RatingCalculator.calculateAllInterestRatings();

    RatingCalculator.nflPools().forEach((pool) => {
      this.sendPoolEmail(pool._id, pool.latestSeasonId);
    });
  },

  getEmailData(poolId) {
    const pool = Pools.findOne(poolId);
    const poolName = pool.name;
    const poolGameInterestRatings = PoolGameInterestRatings.find(
      {
        poolId,
        rating: {
          $gte: 50,
        },
      },
      {
        sort: {
          rating: -1,
        },
        limit: 5,
      },
    );

    return {
      poolId,
      poolName,
      poolGameInterestRatings,
    };
  },

  sendPoolEmail(poolId, seasonId) {
    log.info(`Sending games to watch email to pool ${poolId} for season ${seasonId}`);

    const playerEmails = Common.getPlayerEmails(poolId, seasonId);

    const data = this.getEmailData(poolId);
    if (data.poolGameInterestRatings.count() === 0) {
      log.info(`Not sending games to watch email to pool ${poolId} because there are no interest ratings.`);
      return;
    }

    const success = Mailer.send({
      to: playerEmails,
      subject: `Games to watch for ${data.poolName}`,
      template: 'weeklyGamesToWatchTemplate',
      data,
    });

    if (success) {
      log.info(`Successfully sent games to watch email to pool ${poolId} for season ${seasonId}`);
    } else {
      throwError(`Error sending games to watch email to ${data.poolName}`);
    }
  },
};
