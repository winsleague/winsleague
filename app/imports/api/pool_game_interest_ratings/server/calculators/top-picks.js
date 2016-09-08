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
    let justification = '';

    const pickDifference = Math.abs(homePickNumber - awayPickNumber);

    if (homePickNumber < 6 && awayPickNumber < 6) {
      rating = 100;
      justification = 'Both teams are top 5 picks';
    } else if (homePickNumber > 27 && awayPickNumber > 27) {
      rating = 70;
      justification = 'Both teams are bottom 5 picks';
    } else if (pickDifference < 5) {
      rating = 80;
      justification = 'Both teams were picked close to one another';
    }

    return {
      rating,
      justification,
    };
  },
};

