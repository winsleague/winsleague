import { _ } from 'lodash';
import log from '../../../../utils/log';

import { Games } from '../../../games/games';

export default {
  justification: () => 'teams have similar records over last few games',

  recentGameCount: () => 8,

  rating(pool, game) {
    const homeWinCount = this.recentWinCount(game.homeTeamId);
    const awayWinCount = this.recentWinCount(game.awayTeamId);

    const rating = this._rating(homeWinCount, awayWinCount);

    log.info(`Rating for poolId ${pool._id} and gameId ${game._id} is ${rating} (homeRecentWinCount: ${homeWinCount}, awayRecentWinCount: ${awayWinCount})`);

    return rating;
  },

  _rating(homeWins, awayWins) {
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
        rating = 50;
        break;
      case 3:
        rating = 40;
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

    return rating;
  },

  recentWinCount(leagueTeamId) {
    const games = Games.find({
      $or: [
        {
          homeTeamId: leagueTeamId,
        },
        {
          awayTeamId: leagueTeamId
        },
      ],
      status: 'completed',
    }, {
      sort: {
        gameDate: -1,
      },
      limit: this.recentGameCount(),
    }).fetch();

    // TODO: use _.sum instead
    let wins = 0;
    games.forEach(game => {
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

