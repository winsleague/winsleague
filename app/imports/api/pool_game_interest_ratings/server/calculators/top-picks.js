import log from '../../../../utils/log';

import { PoolTeamPicks } from '../../../pool_team_picks/pool_team_picks';

export default {
  name: () => 'Top Picks',

  justification: () => 'top picks playing each other',

  rating(pool, game) {
    // totalPickNumber = 1+2 = 3 ==> 100
    // totalPickNumber = 31+32 = 63 ==> 0

    const homePoolTeamPick = PoolTeamPicks.findOne({
      seasonId: pool.latestSeasonId,
      poolId: pool._id,
      leagueTeamId: game.homeTeamId,
    });

    const awayPoolTeamPick = PoolTeamPicks.findOne({
      seasonId: pool.latestSeasonId,
      poolId: pool._id,
      leagueTeamId: game.awayTeamId,
    });

    if (!homePoolTeamPick || !awayPoolTeamPick) {
      return 0;
    }

    if (homePoolTeamPick.poolTeamId === awayPoolTeamPick.poolTeamId) {
      // if same player picked both teams, we don't care
      return 0;
    }

    const rating = this._rating(homePoolTeamPick.pickNumber, awayPoolTeamPick.pickNumber);

    log.info(`Rating for poolId ${pool._id} and gameId ${game._id} is ${rating} (homePickNumber: ${homePoolTeamPick.pickNumber}, awayPickNumber: ${awayPoolTeamPick.pickNumber})`);

    return rating;
  },

  _rating(homePickNumber, awayPickNumber) {
    const totalPickNumber = homePickNumber + awayPickNumber;
    const minTotalPickNumber = 1 + 2;
    const maxTotalPickNumber = 31 + 32;

    const inverseIndex = ((totalPickNumber - minTotalPickNumber) * 100.0) /
      (maxTotalPickNumber - minTotalPickNumber);
    // top picks => 0
    // last picks => 100
    // so let's flip it

    return Math.abs(inverseIndex - 100);
  },
};

