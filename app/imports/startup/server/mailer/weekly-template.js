import { Pools } from '../../../api/pools/pools';
import { PoolTeams } from '../../../api/pool_teams/pool_teams';

export default {
  path: 'weekly-email/template.html',    // Relative to the 'private' dir.
  css: 'weekly-email/style.css',       // Mail specific CSS.

  helpers: {
    preview() {
      return `Weekly Wins Leaderboard for ${this.poolName}`;
    },
  },

  route: {
    path: '/weekly/pools/:poolId/seasons/:seasonId',
    data(params) {
      const poolId = params.poolId;
      const seasonId = params.seasonId;
      const pool = Pools.findOne(poolId);
      const poolName = pool.name;
      const poolTeams = PoolTeams.find({ poolId, seasonId },
        { sort: { totalWins: -1, totalPlusMinus: -1 } });
      return {
        poolId,
        seasonId,
        poolName,
        poolTeams,
      };
    },
  },
};
