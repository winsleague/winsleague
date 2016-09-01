import { PoolTeamPicks } from '../pool_team_picks';
import { Pools } from '../../pools/pools';
import PoolTeamUpdater from '../../pool_teams/server/updater';
import RatingCalculator from '../../pool_game_interest_ratings/server/calculator';

// performance improvement - https://github.com/matb33/meteor-collection-hooks#afterupdateuserid-doc-fieldnames-modifier-options
PoolTeamPicks.hookOptions.after.update = { fetchPrevious: false };

function updatePoolTeam(doc) {
  PoolTeamUpdater.updateTeamSummary(doc.poolTeamId);
  PoolTeamUpdater.updatePoolTeamRecord(doc.poolTeamId);
  PoolTeamUpdater.updatePoolTeamPickQuality(doc.poolTeamId);

  const pool = Pools.findOne(doc.poolId);
  RatingCalculator.calculatePoolInterestRatings(pool);
}

PoolTeamPicks.after.insert((userId, doc) => {
  updatePoolTeam(doc);
});

PoolTeamPicks.after.update((userId, doc, fieldNames, modifier, options) => {
  updatePoolTeam(doc);
});

PoolTeamPicks.after.remove((userId, doc) => {
  updatePoolTeam(doc);
});
