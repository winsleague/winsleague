import log from '../../../utils/log';

import { Seasons } from '../seasons';
import { Pools } from '../../pools/pools';
import { PoolTeams } from '../../pool_teams/pool_teams';
import LeagueFinder from '../../leagues/finder';
import SeasonFinder from '../../seasons/finder';

export default {
  create(leagueName, year, startDate, endDate) {
    if (SeasonFinder.getByYear(leagueName, year)) {
      log.info(`${year} season already exists for league ${leagueName}!`);
      return;
    }

    const leagueId = LeagueFinder.getIdByName(leagueName);

    const originalLatestSeason = SeasonFinder.getLatestByLeagueName(leagueName);

    const newLatestSeasonId = Seasons.insert({
      leagueId,
      leagueName,
      year,
      startDate,
      endDate,
    });
    log.info('Created new season ', newLatestSeasonId);

    Pools.find({ leagueId }).forEach(pool => {
      log.info(`Updating poolId ${pool._id} with latestSeasonId ${newLatestSeasonId}`);
      Pools.direct.update(pool._id, {
        $set: {
          latestSeasonId: newLatestSeasonId,
        },
      });

      PoolTeams.find({ poolId: pool._id, seasonId: originalLatestSeason._id }).forEach(poolTeam => {
        log.info(`Migrating poolTeams for poolId ${pool._id} to seasonId ${newLatestSeasonId}`);
        PoolTeams.insert({
          leagueId,
          seasonId: newLatestSeasonId,
          poolId: pool._id,
          userId: poolTeam.userId,
          userTeamName: poolTeam.userTeamName,
        });
      });
    });
  },

  remove(leagueName, year) {
    const leagueId = LeagueFinder.getIdByName(leagueName);

    const newLatestSeason = SeasonFinder.getByYear(leagueName, year);
    if (! newLatestSeason) {
      log.info(`Season for ${year} doesn't exist!`);
      return;
    }

    PoolTeams.remove({ seasonId: newLatestSeason._id });
    Seasons.remove({ _id: newLatestSeason._id });

    const originalLatestSeason = SeasonFinder.getLatestByLeagueName(leagueName);

    Pools.find({ leagueId }).forEach(pool => {
      log.info(`Updating poolId ${pool._id} with original seasonId ${originalLatestSeason._id}`);
      Pools.update(pool._id, {
        $set: {
          latestSeasonId: originalLatestSeason._id,
        },
      });
    });
  },
};
