import { _ } from 'lodash';
import { Mailer } from 'meteor/lookback:emails';

import log from '../../../utils/log';

import Common from './common';
import { Seasons } from '../../seasons/seasons';
import { Pools } from '../../pools/pools';
import { PoolTeams } from '../../pool_teams/pool_teams';

export default {
  sendAll() {
    log.info('Sending out weekly leaderboard email');

    const seasons = this.findActiveSeasons();
    seasons.forEach(season => {
      const poolIds = this.findEligiblePoolIds(season._id);
      poolIds.forEach(poolId => {
        this.sendIndividual(poolId, seasonId);
      });
    });
  },

  sendIndividual(poolId, seasonId) {
    log.info(`Emailing weekly leaderboard report to pool ${poolId}`);

    const pool = Pools.findOne(poolId);
    const poolName = pool.name;
    const poolTeams = PoolTeams.find({
      poolId,
      seasonId,
    }, {
      sort: {
        totalWins: -1,
        totalPlusMinus: -1,
      },
    });

    const playerEmails = Common.getPlayerEmails(poolId, seasonId);

    Mailer.send({
      to: playerEmails,
      subject: `Wins Leaderboard for ${poolName}`,
      template: 'weeklyEmail',
      data: {
        poolId,
        seasonId,
        poolName,
        poolTeams,
      },
    });
  },

  findActiveSeasons() {
    const today = new Date();
    return Seasons.find({
      startDate: {
        $lte: today,
      },
      endDate: {
        $gte: today,
      },
    });
  },

  findEligiblePoolIds(seasonId) {
    const poolAggregation = PoolTeams.aggregate([
      {
        $match: {
          seasonId,
        },
      },
      {
        $group: {
          _id: '$poolId',
          poolId: { $first: '$poolId' },
        },
      },
    ]);
    return poolAggregation.map(result => result._id);
  },
};
