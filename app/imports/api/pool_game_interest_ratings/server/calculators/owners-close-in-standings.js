import log from '../../../../utils/log';

import { PoolTeamPicks } from '../../../pool_team_picks/pool_team_picks';
import { PoolTeams } from '../../../pool_teams/pool_teams';

export default {
  justification: () => 'owners are close in standings',

  rating(pool, game, homePoolTeamPick, awayPoolTeamPick) {
    const homePoolTeam = PoolTeams.findOne(homePoolTeamPick.poolTeamId);
    const awayPoolTeam = PoolTeams.findOne(awayPoolTeamPick.poolTeamId);

    const mostWins = this.poolMostWins(pool);
    const leastWins = this.poolLeastWins(pool);

    const rating = this._rating(homePoolTeam.totalWins, awayPoolTeam.totalWins, mostWins, leastWins);

    log.info(`Rating for poolId ${pool._id} and gameId ${game._id} is ${rating} (homePoolTeamWins: ${homePoolTeam.totalWins}, awayPoolTeamWins: ${awayPoolTeam.totalWins})`);

    return rating;
  },

  _rating(homeWins, awayWins, mostWins, leastWins) {
    if (mostWins === 0) {
      // this calculator doesn't make much sense unless there are some games played
      return 0;
    }

    let rating;

    const winDifference = Math.abs(homeWins - awayWins);
    switch (winDifference) {
      case 0:
        rating = 90;
        break;
      case 1:
        rating = 80;
        break;
      case 2:
        rating = 70;
        break;
      case 3:
        rating = 60;
        break;
      case 4:
        rating = 50;
        break;
      default:
        rating = 0;
        break;
    }

    // +10 bonus if both teams are at the top/bottom 20% of standings
    const topTwentieth = (0.8 * (mostWins - leastWins)) + leastWins;
    const bottomTwentieth = (0.2 * (mostWins - leastWins)) + leastWins;

    const isTopPercentile = homeWins >= topTwentieth && awayWins >= topTwentieth;
    const isBottomPercentile = homeWins <= bottomTwentieth && awayWins <= bottomTwentieth;

    if (isTopPercentile || isBottomPercentile) {
      rating += 10;
    }

    return rating;
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

