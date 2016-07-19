import { Migrations } from 'meteor/percolate:migrations';
import log from '../../imports/startup/log';
import { Pools } from '../../imports/api/pools/pools';
import SeasonFinder from '../../imports/api/seasons/finder';

Migrations.add({
  version: 4,
  name: 'Adds latest season field to Pools',
  up: () => {
    Pools.find().forEach(pool => {
      if (!pool.latestSeasonId) {
        // select latest season for league
        const leagueId = pool.leagueId;
        const latestSeason = SeasonFinder.getLatestByLeagueId(leagueId);
        if (latestSeason) {
          log.info(`Updating poolId ${pool._id} with latestSeasonId ${latestSeason._id}`);
          Pools.update(pool._id, {
            $set: {
              latestSeasonId: latestSeason._id,
            },
          });
        } else {
          throw new Error(`No season found for leagueId ${leagueId}`);
        }
      }
    });
  },
  down: () => {
    Pools.update({}, {
      $unset: {
        latestSeasonId: '',
      },
    }, {
      multi: true,
    });
  },
});
