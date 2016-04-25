import { PoolTeamPicks } from '../pool_team_picks'
import PoolTeamMethods from '../../pool_teams/server/methods';

// performance improvement - https://github.com/matb33/meteor-collection-hooks#afterupdateuserid-doc-fieldnames-modifier-options
PoolTeamPicks.hookOptions.after.update = { fetchPrevious: false };

function updatePoolTeam(doc) {
  PoolTeamMethods.updateTeamSummary(doc.poolTeamId);
  PoolTeamMethods.updatePoolTeamWins(doc.poolTeamId);
  PoolTeamMethods.updatePoolTeamPickQuality(doc.poolTeamId);
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
