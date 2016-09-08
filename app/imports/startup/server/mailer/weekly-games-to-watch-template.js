import { Pools } from '../../../api/pools/pools';
import { PoolGameInterestRatings } from '../../../api/pool_game_interest_ratings/pool_game_interest_ratings';

export default {
  path: 'weekly-games-to-watch-email/template.html',    // Relative to the 'private' dir.
  css: 'weekly-games-to-watch-email/style.css',       // Mail specific CSS.

  helpers: {
    preview() {
      return `Games to watch for ${this.poolName}`;
    },
  },

  route: {
    path: '/weekly-games-to-watch-email/pools/:poolId',
    data(params) {
      const poolId = params.poolId;
      const pool = Pools.findOne(poolId);
      const poolName = pool.name;
      const poolGameInterestRatings = PoolGameInterestRatings.find(
        {
          poolId,
          rating: {
            $gte: 50,
          },
        },
        {
          sort: {
            rating: -1,
          },
          limit: 5,
        });

      return {
        poolId,
        poolName,
        poolGameInterestRatings,
      };
    },
  },
};
