import log from '../../../../utils/log';

import { PoolTeams } from '../../../pool_teams/pool_teams';

export default {
  name: () => 'PoolTeamsTotalPoints',

  calculate(pool, game, homePoolTeamPick, awayPoolTeamPick) {
    const homePoolTeam = PoolTeams.findOne(homePoolTeamPick.poolTeamId);
    const awayPoolTeam = PoolTeams.findOne(awayPoolTeamPick.poolTeamId);

    const mostWins = this.poolMostPoints(pool);
    const leastWins = this.poolLeastPoints(pool);

    const result = this.calculateFromPoints(homePoolTeam.totalPoints, awayPoolTeam.totalPoints, mostWins, leastWins);

    log.info(`Rating for poolId ${pool._id} and gameId ${game._id} is ${result.rating} \
(homePoolTeamWins: ${homePoolTeam.totalPoints}, awayPoolTeamWins: ${awayPoolTeam.totalPoints})`);

    return result;
  },

  calculateFromPoints(homePoints, awayPoints, mostPoints, leastPoints) {
    if (mostPoints === 0) {
      // this calculator doesn't make much sense unless there are some games played
      return {
        rating: 0,
        justification: '',
      };
    }

    let rating;
    let justification = '';

    const winDifference = Math.abs(homePoints - awayPoints);
    switch (winDifference) {
      case 0:
        rating = 90;
        justification = `Both owners have ${homePoints} wins`;
        break;
      case 1:
        rating = 80;
        justification = 'Owners are only separated by one win';
        break;
      case 2:
        rating = 70;
        justification = `Owners are only separated by ${homePoints} wins`;
        break;
      case 3:
        rating = 60;
        justification = `Owners are only separated by ${homePoints} wins`;
        break;
      case 4:
        rating = 50;
        justification = `Owners are only separated by ${homePoints} wins`;
        break;
      default:
        rating = 0;
        break;
    }

    // add bonus if both teams are at the top/bottom 20% of standings
    const topTwentieth = (0.8 * (mostPoints - leastPoints)) + leastPoints;
    const bottomTwentieth = (0.2 * (mostPoints - leastPoints)) + leastPoints;

    const isTopPercentile = homePoints >= topTwentieth && awayPoints >= topTwentieth;
    const isBottomPercentile = homePoints <= bottomTwentieth && awayPoints <= bottomTwentieth;

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

  poolMostPoints(pool) {
    const team = PoolTeams.findOne({
      poolId: pool._id,
      seasonId: pool.latestSeasonId,
    }, {
      sort: {
        totalPoints: -1,
      },
      limit: 1,
    });

    return team.totalPoints;
  },

  poolLeastPoints(pool) {
    const team = PoolTeams.findOne({
      poolId: pool._id,
      seasonId: pool.latestSeasonId,
    }, {
      sort: {
        totalPoints: 1,
      },
      limit: 1,
    });

    return team.totalPoints;
  },
};
