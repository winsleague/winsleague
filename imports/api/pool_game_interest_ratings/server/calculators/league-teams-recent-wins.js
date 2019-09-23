import log from '../../../../utils/log';

import { Games } from '../../../games/games';

export default {
  name: () => 'LeagueTeamsRecentWins',

  recentGameCount: () => 8,

  calculate(pool, game) {
    const homeWinCount = this.recentWinCount(game.homeTeamId);
    const awayWinCount = this.recentWinCount(game.awayTeamId);

    const result = this.calculateFromWins(homeWinCount, awayWinCount);

    log.info(`Rating for poolId ${pool._id} and gameId ${game._id} is ${result.rating} \
(homeRecentWinCount: ${homeWinCount}, awayRecentWinCount: ${awayWinCount})`);

    return result;
  },

  calculateFromWins(homeWins, awayWins) {
    let rating;
    let justification = '';

    const winDifference = Math.abs(homeWins - awayWins);
    switch (winDifference) {
      case 0:
        rating = 75;
        justification = `Both teams have ${homeWins} wins in their last ${this.recentGameCount()} games`;
        break;
      case 1:
        rating = 65;
        justification = `Each team has only a one win difference in their last ${this.recentGameCount()} games`;
        break;
      case 2:
        rating = 50;
        justification = `Each team has only a two win difference in their last ${this.recentGameCount()} games`;
        break;
      default:
        rating = 0;
        break;
    }

    const mostWins = this.recentGameCount();
    const leastWins = 0;

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

  recentWinCount(leagueTeamId) {
    const games = Games.find({
      $or: [
        {
          homeTeamId: leagueTeamId,
        },
        {
          awayTeamId: leagueTeamId,
        },
      ],
      status: 'completed',
    }, {
      sort: {
        gameDate: -1,
      },
      limit: this.recentGameCount(),
    }).fetch();

    let wins = 0;
    games.forEach((game) => {
      if (game.homeTeamId === leagueTeamId && game.homeScore > game.awayScore) {
        wins += 1;
      }

      if (game.awayTeamId === leagueTeamId && game.awayScore > game.homeScore) {
        wins += 1;
      }
    });

    return wins;
  },
};
