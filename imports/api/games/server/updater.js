import log from '../../../utils/log';

import { Games } from '../games';
import '../../season_league_teams/server/hooks';

export default {
  updateWinner(game) {
    if (game.status !== 'completed') {
      return;
    }

    let winnerTeamId;
    let loserTeamId;
    if (game.homeScore > game.awayScore) {
      winnerTeamId = game.homeTeamId;
      loserTeamId = game.awayTeamId;
    } else if (game.awayScore > game.homeScore) {
      winnerTeamId = game.awayTeamId;
      loserTeamId = game.homeTeamId;
    }

    if (winnerTeamId) {
      log.info(`Update game ${game._id} winner to ${winnerTeamId} and loser to ${loserTeamId}`);

      Games.direct.update(game._id,
        {
          $set: {
            winnerTeamId,
            loserTeamId,
          },
        });
    }
  },
};
