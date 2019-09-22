import log from '../../../../utils/log';

import { PoolTeams } from '../../../pool_teams/pool_teams';

export default {
  name: () => 'PoolTeamsTotalWins',

  calculate(pool, game, homePoolTeamPick, awayPoolTeamPick) {
    const homePoolTeam = PoolTeams.findOne(homePoolTeamPick.poolTeamId);
    const awayPoolTeam = PoolTeams.findOne(awayPoolTeamPick.poolTeamId);

    const mostWins = this.poolMostWins(pool);
    const leastWins = this.poolLeastWins(pool);

    const result = this.calculateFromWins(homePoolTeam.totalWins, awayPoolTeam.totalWins, mostWins, leastWins);

    log.info(`Rating for poolId ${pool._id} and gameId ${game._id} is ${result.rating} \
(homePoolTeamWins: ${homePoolTeam.totalWins}, awayPoolTeamWins: ${awayPoolTeam.totalWins})`);

    return result;
  },

  calculateFromWins(homeWins, awayWins, mostWins, leastWins) {
    if (mostWins === 0) {
      // this calculator doesn't make much sense unless there are some games played
      return {
        rating: 0,
        justification: '',
      };
    }

    let rating;
    let justification = '';

    const winDifference = Math.abs(homeWins - awayWins);
    switch (winDifference) {
      case 0:
        rating = 90;
        justification = `Both owners have ${homeWins} wins`;
        break;
      case 1:
        rating = 80;
        justification = 'Owners are only separated by one win';
        break;
      case 2:
        rating = 70;
        justification = `Owners are only separated by ${homeWins} wins`;
        break;
      case 3:
        rating = 60;
        justification = `Owners are only separated by ${homeWins} wins`;
        break;
      case 4:
        rating = 50;
        justification = `Owners are only separated by ${homeWins} wins`;
        break;
      default:
        rating = 0;
        break;
    }

    // add bonus if both teams are at the top/bottom 20% of standings
    const topTwentieth = (0.8 * (mostWins - leastWins)) + leastWins;
    const bottomTwentieth = (0.2 * (mostWins - leastWins)) + leastWins;

    const isTopPercentile = homeWins >= topTwentieth && awayWins >= topTwentieth;
    const isBottomPercentile = homeWins <= bottomTwentieth && awayWins <= bottomTwentieth;

    if (isTopPercentile) {
      rating += 10;
    } else if (isBottomPercentile) {
      rating += 5;
    }

    return {
      rating,
      justification,
    };
  },

  poolMostWins(pool) {
    const team = PoolTeams.findOne({
      poolId: pool._id,
      seasonId: pool.latestSeasonId,
    }, {
      sort: {
        totalWins: -1,
      },
      limit: 1,
    });

    return team.totalWins;
  },

  poolLeastWins(pool) {
    const team = PoolTeams.findOne({
      poolId: pool._id,
      seasonId: pool.latestSeasonId,
    }, {
      sort: {
        totalWins: 1,
      },
      limit: 1,
    });

    return team.totalWins;
  },
};
