import Migrations from 'meteor/percolate:migrations';
import { PoolTeams } from '../../imports/api/pool_teams/pool_teams';
import PoolTeamsUpdater from '../../imports/api/pool_teams/server/updater';

Migrations.add({
  version: 1,
  name: 'Adds totalLosses field to PoolTeams and populates it',
  up: () => {
    PoolTeams.find().forEach(poolTeam => {
      PoolTeamsUpdater.updatePoolTeamWins(poolTeam);
    });
  },
  down: () => {
    PoolTeams.update({}, { $unset: { totalLosses: '' } }, { multi: true });
  },
});
