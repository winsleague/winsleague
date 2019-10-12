import { Migrations } from 'meteor/percolate:migrations';
import { PoolTeams } from '../../imports/api/pool_teams/pool_teams';
import { PoolTeamPicks } from '../../imports/api/pool_team_picks/pool_team_picks';

Migrations.add({
  version: 20,
  name: 'Adds totalPoints',
  up: () => {
    PoolTeamPicks.find().forEach((poolTeamPick) => {
      PoolTeamPicks.direct.update(poolTeamPick._id,
        {
          $set: {
            pointsMetric: 'wins',
            totalPoints: poolTeamPick.totalWins,
          },
        });
    });

    PoolTeams.find().forEach((poolTeam) => {
      PoolTeams.direct.update(poolTeam._id,
        {
          $set: {
            totalPoints: poolTeam.totalWins,
            totalLostPoints: poolTeam.totalLosses,
          },
        });
    });
  },
  down: () => {
    PoolTeams.direct.update({}, { $unset: { totalPoints: '', totalLostPoints: '' } }, { multi: true });
    PoolTeamPicks.direct.update({}, { $unset: { totalPoints: '', totalLostPoints: '', pointsMetric: '' } }, { multi: true });
  },
});
