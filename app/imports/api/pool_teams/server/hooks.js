import { PoolTeams } from '../pool_teams';
import { PoolTeamPicks } from '../../pool_team_picks/pool_team_picks';

PoolTeams.before.remove((userId, doc) => {
  PoolTeamPicks.remove({ poolTeamId: doc._id });
});
