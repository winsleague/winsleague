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
      const pools = this.findEligiblePools(season._id);
      pools.forEach((pool) => {
        this.sendIndividual(pool._id, season._id);
      });
    });
  },

  getEmailData(poolId, seasonId) {
    log.info(`Getting leaderboard email data for pool ${poolId} and seasonId ${seasonId}`);

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
      },
    );
    if (!bestPick) {
      log.error(`Unable to find best pick for pool ${poolId} and seasonId ${seasonId}`);
      return null;
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
      },
    );
    if (!worstPick) {
      log.error(`Unable to find worst pick for pool ${poolId} and seasonId ${seasonId}`);
      return null;
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
    log.info(`Sending leaderboard email to pool ${poolId} for season ${seasonId}`);

    const playerEmails = Common.getPlayerEmails(poolId, seasonId);

    if (!playerEmails) {
      log.info(`Not sending leaderboard email because no one has drafted anyone. pool ${poolId} for season ${seasonId}`);
      return;
    }

    const data = this.getEmailData(poolId, seasonId);
    if (!data) {
      log.info(`Not sending leaderboard email to pool ${poolId} because of no template data.`);
      return;
    }

    const success = Mailer.send({
      to: playerEmails,
      subject: `Wins Leaderboard for ${data.poolName}`,
      template: 'weeklyLeaderboardTemplate',
      data,
    });

    if (success) {
      log.info(`Successfully sent leaderboard email to pool ${poolId} for season ${seasonId}`);
    } else {
      throwError(`Error sending leaderboard email to pool ${poolId} (${data.poolName})`);
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

  findEligiblePools(seasonId) {
    return Pools.find({
      latestSeasonId: seasonId,
    });
  },
};
