/* Hooks */

// performance improvement - https://github.com/matb33/meteor-collection-hooks#afterupdateuserid-doc-fieldnames-modifier-options
PoolTeamPicks.hookOptions.after.update = { fetchPrevious: false };

function updatePoolTeam(doc) {
  const poolTeam = PoolTeams.findOne(doc.poolTeamId);
  Modules.server.poolTeams.updatePicks(poolTeam);
  Modules.server.poolTeams.updatePoolTeamWins(poolTeam);
  Modules.server.poolTeams.updatePoolTeamPickQuality(poolTeam);
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
