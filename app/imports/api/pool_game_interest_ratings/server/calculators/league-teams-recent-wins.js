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

  recentWinCount(leagueTeamId) {
    // TODO: this should look for last 8 games in which the leagueTeam was *either* the hometeam or awayteam

    const homeGames = Games.find({
      homeTeamId: leagueTeamId,
      status: 'completed',
    }, {
      sort: {
        gameDate: -1,
      },
      limit: this.recentGameCount(),
    }).fetch();

    // TODO: use _.sum instead
    let homeWins = 0;
    homeGames.forEach(game => {
    // const homeWins = _.countBy(homeGames, game => {
      if (game.homeScore > game.awayScore) {
        homeWins += 1;
      }
    });

    const awayGames = Games.find({
      awayTeamId: leagueTeamId,
      status: 'completed',
    }, {
      sort: {
        gameDate: -1,
      },
      limit: this.recentGameCount(),
    }).fetch();

    let awayWins = 0;
    awayGames.forEach(game => {
    // const awayWins = _.sum(awayGames, game => {
      if (game.awayScore > game.homeScore) {
        awayWins += 1
      }
    });

    return homeWins + awayWins;
  },
};

