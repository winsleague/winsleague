import { Pools } from '../pools';
import { PoolTeams } from '../../pool_teams/pool_teams';

Pools.before.remove((userId, doc) => {
  PoolTeams.remove({ poolId: doc._id });
});
