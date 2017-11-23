import { Migrations } from 'meteor/percolate:migrations';
import LeagueFinder from '../../imports/api/leagues/finder';
import { PoolTeams } from '../../imports/api/pool_teams/pool_teams';
import { PoolTeamWeeks } from '../../imports/api/pool_team_weeks/pool_team_weeks';
import PoolTeamWeeksUpdater from '../../imports/api/pool_team_weeks/server/updater';

Migrations.add({
  version: 13,
  name: 'Generate historical PoolTeamWeeks',
  up: () => {
    const nflLeague = LeagueFinder.getByName('NFL');
    const poolTeams = PoolTeams.find({
      leagueId: nflLeague._id,
    });

    poolTeams.forEach((poolTeam) => {
      for (let week = 1; week <= 17; week += 1) {
        PoolTeamWeeksUpdater.updatePoolTeam(poolTeam._id, week);
      }
    });
  },
  down: () => {
    PoolTeamWeeks.remove({});
  },
});
