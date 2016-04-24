import { log } from '../imports/startup/log';
import { _ } from 'lodash';
import { Mailer } from 'meteor/lookback:emails';

import { Seasons } from '../imports/api/seasons/seasons';
import { Pools } from '../imports/api/pools/pools';
import { PoolTeams } from '../imports/api/pool_teams/pool_teams';

export default {
  emailReports() {
    log.info('Sending out weekly email report');

    const seasons = this.findActiveSeasons();
    seasons.forEach(season => {
      const poolIds = this.findEligiblePoolIds(season._id);
      poolIds.forEach(poolId => {
        this.emailReport(poolId, season._id);
      });
    });
  },

  emailReport(poolId, seasonId) {
    log.info(`Emailing weekly report to pool ${poolId} for season ${seasonId}`);

    const pool = Pools.findOne(poolId);
    const poolName = pool.name;
    const poolTeams = PoolTeams.find({ poolId, seasonId },
      { sort: { totalWins: -1, totalPlusMinus: -1 } });

    const playerEmails = this.getPlayerEmails(poolId, seasonId);

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

  getPlayerEmails(poolId, seasonId) {
    // each userId can have multiple emails
    // each email has an address property and a verified property
    // return in the format 'name <email@domain.com>, name <email@domain.com>'

    const players = PoolTeams.find({ poolId, seasonId })
      .map(poolTeam => {
        return {
          _id: poolTeam.userId,
          teamName: poolTeam.userTeamName,
        };
      });

    const emailArray = _.flatten(players.map(player => {
      return _.flatten(Meteor.users.find(player._id)
        .map(user => user.emails))
        .map(email => `${player.teamName} <${email.address}>`);
    }));

    return emailArray.join(', ');
  },
};
