import { Migrations } from 'meteor/percolate:migrations';
import { Games } from '../../imports/api/games/games';
import GameUpdater from '../../imports/api/games/server/updater';

Migrations.add({
  version: 7,
  name: 'Update game winners and losers',

  up: () => {
    Games.find({
      status: 'completed',
    }).forEach((game) => {
      GameUpdater.updateWinner(game);
    });
  },

  down: () => {
    Games.update({},
      {
        $unset: {
          winnerTeamId: '',
          loserTeamId: '',
        },
      },
      {
        multi: true,
      });
  },
});
