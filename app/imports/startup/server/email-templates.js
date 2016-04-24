import '../../api/pools';
import '../../api/pool_teams';

export default {
  path: 'weekly-email/template.html',    // Relative to the 'private' dir.
  scss: 'weekly-email/style.scss',       // Mail specific SCSS.

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
