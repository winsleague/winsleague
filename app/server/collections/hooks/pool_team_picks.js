/* Hooks */

// performance improvement - https://github.com/matb33/meteor-collection-hooks#afterupdateuserid-doc-fieldnames-modifier-options
PoolTeamPicks.hookOptions.after.update = { fetchPrevious: false };

PoolTeamPicks.after.insert((userId, doc) => {
  const poolTeam = PoolTeams.findOne(doc.poolTeamId);
  Modules.server.poolTeams.updatePicks(poolTeam);
});

PoolTeamPicks.after.update((userId, doc, fieldNames, modifier, options) => {
  const poolTeam = PoolTeams.findOne(doc.poolTeamId);
  Modules.server.poolTeams.updatePicks(poolTeam);
});

PoolTeamPicks.after.remove((userId, doc) => {
  const poolTeam = PoolTeams.findOne(doc.poolTeamId);
  Modules.server.poolTeams.updatePicks(poolTeam);
});
