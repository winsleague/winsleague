import { Mailer } from 'meteor/lookback:emails';
import moment from 'moment';

import log from '../../../utils/log';

import RatingCalculator from '../../pool_game_interest_ratings/server/calculator';
import LeagueFinder from '../../leagues/finder';
import { Games } from '../../games/games';
import { Pools } from '../../pools/pools';
import { PoolTeamPicks } from '../../pool_team_picks/pool_team_picks';

export default {
  sendAll() {
    log.info('Sending out weekly top upcoming games email');

    this.calculateAllInterestRatings();

    this.nflPools().forEach(pool => {
      this.sendPoolEmail(pool);
    });
  },

  calculateAllInterestRatings() {
    this.nflPools().forEach(pool => {
      this.calculatePoolInterestRatings(pool);
    });
  },

  calculatePoolInterestRatings(pool) {
    this.eligibleGames(pool).forEach(game => {
      RatingCalculator.calculate(pool, game);
    });
  },

  eligibleGames(pool) {
    const leagueId = LeagueFinder.getIdByName('NFL');

    const startDate = moment().toDate();
    const endDate = moment().add(29, 'days').toDate();

    log.info(`Upcoming games from ${startDate} to ${endDate}`);

    const upcomingGames = Games.find({
      leagueId,
      gameDate: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    // make sure both teams of each game were picked
    return _.filter(upcomingGames.fetch(), game => {
      const homePick = PoolTeamPicks.findOne({
        seasonId: game.seasonId,
        poolId: pool._id,
        leagueTeamId: game.homeTeamId,
      });

      const awayPick = PoolTeamPicks.findOne({
        seasonId: game.seasonId,
        poolId: pool._id,
        leagueTeamId: game.awayTeamId,
      });

      if (homePick && awayPick) {
        log.info(`Including game ${game._id} for pool ${pool._id} because both teams were picked`);
        return true;
      }

      log.debug(`Excluding game ${game._id} for pool ${pool._id} because both teams were not picked`);
      return false;
    });
  },

  nflPools() {
    const leagueId = LeagueFinder.getIdByName('NFL');

    return Pools.find({ leagueId });
  },

  sendPoolEmail(pool) {
    // look for top interest ratings
  }
};
