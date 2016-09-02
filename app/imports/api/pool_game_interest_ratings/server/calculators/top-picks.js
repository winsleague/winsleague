import log from '../../../../utils/log';

import { PoolTeamPicks } from '../../../pool_team_picks/pool_team_picks';

export default {
  name: () => 'TopPicks',

  calculate(pool, game, homePoolTeamPick, awayPoolTeamPick) {
    // totalPickNumber = 1+2 = 3 ==> 100
    // totalPickNumber = 31+32 = 63 ==> 0

    const result = this._calculate(homePoolTeamPick.pickNumber, awayPoolTeamPick.pickNumber);

    log.info(`Rating for poolId ${pool._id} and gameId ${game._id} is ${result.rating} (homePickNumber: ${homePoolTeamPick.pickNumber}, awayPickNumber: ${awayPoolTeamPick.pickNumber})`);

    return result;
  },

  _calculate(homePickNumber, awayPickNumber) {
    let rating = 0;

    const pickDifference = Math.abs(homePickNumber - awayPickNumber);

    if (homePickNumber < 6 && awayPickNumber < 6) {
      rating = 100;
    } else if (homePickNumber > 27 && awayPickNumber > 27) {
      rating = 90;
    } else if (pickDifference < 5) {
      rating = 80;
    }

    return {
      rating,
      justification: 'top/close/bottom picks playing each other',
    };
  },
};

