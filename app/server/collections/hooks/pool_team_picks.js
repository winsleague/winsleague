/* Hooks */

// performance improvement - https://github.com/matb33/meteor-collection-hooks#afterupdateuserid-doc-fieldnames-modifier-options
PoolTeamPicks.hookOptions.after.update = { fetchPrevious: false };

PoolTeamPicks.after.insert((userId, doc) => {
  Modules.server.poolTeams.updatePicks(doc);
});

PoolTeamPicks.after.update((userId, doc, fieldNames, modifier, options) => {
  Modules.server.poolTeams.updatePicks(doc);
});

PoolTeamPicks.after.remove((userId, doc) => {
  Modules.server.poolTeams.updatePicks(doc);
});
