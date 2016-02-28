/* Hooks */

// performance improvement - https://github.com/matb33/meteor-collection-hooks#afterupdateuserid-doc-fieldnames-modifier-options
SeasonLeagueTeams.hookOptions.after.update = { fetchPrevious: false };

SeasonLeagueTeams.after.insert(function (userId, doc) {
  Modules.server.poolTeams.updateWhoPickedLeagueTeam(doc.leagueId, doc.seasonId, doc.leagueTeamId);
});

SeasonLeagueTeams.after.update(function (userId, doc, fieldNames, modifier, options) {
  Modules.server.poolTeams.updateWhoPickedLeagueTeam(doc.leagueId, doc.seasonId, doc.leagueTeamId);
});


