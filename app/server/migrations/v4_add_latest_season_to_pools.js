Migrations.add({
  version: 4,
  name: 'Adds latest season field to Pools',
  up: () => {
    Pools.find().forEach(pool => {
      if (!pool.latestSeasonId) {
        // select latest season for league
        const leagueId = pool.leagueId;
        const latestSeason = Modules.seasons.getLatestByLeagueId(leagueId);
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
