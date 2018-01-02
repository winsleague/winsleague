import { Migrations } from 'meteor/percolate:migrations';
import { PoolTeams } from '../../imports/api/pool_teams/pool_teams';
import PoolTeamsUpdater from '../../imports/api/pool_teams/server/updater';

Migrations.add({
  version: 14,
  name: 'Adds totalPickQuality field to PoolTeams and populates it',
  up: () => {
    PoolTeams.find().forEach((poolTeam) => {
      PoolTeamsUpdater.updatePoolTeamRecord(poolTeam._id);
    });
  },
  down: () => {
    PoolTeams.update({}, { $unset: { totalPickQuality: '' } }, { multi: true });
  },
});
