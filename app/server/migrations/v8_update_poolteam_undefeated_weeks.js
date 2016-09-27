import { Migrations } from 'meteor/percolate:migrations';
import log from '../../imports/utils/log';
import { PoolTeams } from '../../imports/api/pool_teams/pool_teams';
import PoolTeamUpdater from '../../imports/api/pool_teams/server/updater';

Migrations.add({
  version: 8,
  name: 'Update pool team undefeated weeks',

  up: () => {
    PoolTeams.find({}).forEach(poolTeam => {
      PoolTeamUpdater.updatePoolTeamUndefeatedWeeks(poolTeam._id);
    });
  },

  down: () => {},
});
