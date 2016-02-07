/* Hooks */

// performance improvement - https://github.com/matb33/meteor-collection-hooks#afterupdateuserid-doc-fieldnames-modifier-options
PoolTeams.hookOptions.after.update = { fetchPrevious: false };

PoolTeams.after.insert((userId, doc) => {
  Modules.server.poolTeams.refreshPoolTeam(doc);
});

PoolTeams.after.update((userId, doc, fieldNames, modifier, options) => {
  Modules.server.poolTeams.refreshPoolTeam(doc);
});

