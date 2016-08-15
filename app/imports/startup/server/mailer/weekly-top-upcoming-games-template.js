import { Pools } from '../../../api/pools/pools';
import { PoolGameInterestRatings } from '../../../api/pool_game_interest_ratings/pool_game_interest_ratings';

export default {
  path: 'weekly-top-upcoming-games-email/template.html',    // Relative to the 'private' dir.
  css: 'weekly-top-upcoming-games-email/style.css',       // Mail specific CSS.

  helpers: {
    preview() {
      return `Top Upcoming Games for ${this.poolName}`;
    },
  },

  route: {
    path: '/weekly-top-upcoming-games-email/pools/:poolId',
    data(params) {
      const poolId = params.poolId;
      const pool = Pools.findOne(poolId);
      const poolName = pool.name;
      const poolGameInterestRatings = PoolGameInterestRatings.find({ poolId },
        { sort: { rating: -1 } });
      return {
        poolId,
        poolName,
        poolGameInterestRatings,
      };
    },
  },
};
