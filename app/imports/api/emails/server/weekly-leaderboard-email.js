import { _ } from 'lodash';
import { Mailer } from 'meteor/lookback:emails';

import log from '../../../utils/log';

import Common from './common';
import { Seasons } from '../../seasons/seasons';
import { Pools } from '../../pools/pools';
import { PoolTeams } from '../../pool_teams/pool_teams';
import { PoolTeamPicks } from '../../pool_team_picks/pool_team_picks';
import { LeagueTeams } from '../../league_teams/league_teams';

export default {
  sendAll() {
    log.info('Sending out weekly leaderboard email');

    const seasons = this.findActiveSeasons();
    seasons.forEach((season) => {
      const poolIds = this.findEligiblePoolIds(season._id);
      poolIds.forEach((poolId) => {
        this.sendIndividual(poolId, season._id);
      });
    });
  },

  getEmailData(poolId, seasonId) {
    log.info(`Getting email data for pool ${poolId} and seasonId ${seasonId}`);

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

    const bestPick = PoolTeamPicks.findOne(
      {
        seasonId,
        poolId,
      },
      {
        sort: {
          pickQuality: -1,
        },
      });
    if (!bestPick) {
      log.error(`Unable to find best pick for pool ${poolId} and seasonId ${seasonId}`);
    }
    const bestPickPoolTeam = PoolTeams.findOne(bestPick.poolTeamId);
    const bestPickLeagueTeam = LeagueTeams.findOne(bestPick.leagueTeamId);

    const worstPick = PoolTeamPicks.findOne(
      {
        seasonId,
        poolId,
      },
      {
        sort: {
          pickQuality: 1,
        },
      });
    if (!worstPick) {
      log.error(`Unable to find worst pick for pool ${poolId} and seasonId ${seasonId}`);
    }
    const worstPickPoolTeam = PoolTeams.findOne(worstPick.poolTeamId);
    const worstPickLeagueTeam = LeagueTeams.findOne(worstPick.leagueTeamId);

    return {
      poolId,
      seasonId,
      poolName,
      poolTeams,
      bestPick,
      bestPickPoolTeam,
      bestPickLeagueTeam,
      worstPick,
      worstPickPoolTeam,
      worstPickLeagueTeam,
    };
  },

  sendIndividual(poolId, seasonId) {
    log.info(`Emailing weekly leaderboard report to pool ${poolId}`);

    const playerEmails = Common.getPlayerEmails(poolId, seasonId);

    const data = this.getEmailData(poolId, seasonId);

    const success = Mailer.send({
      to: playerEmails,
      subject: `Wins Leaderboard for ${data.poolName}`,
      template: 'weeklyLeaderboardTemplate',
      data,
    });

    if (!success) {
      throwError(`Error sending Wins Leaderboard mail to pool ${poolId} (${data.poolName})`);
    }
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
