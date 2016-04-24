import { Games } from '../games';

// performance improvement - https://github.com/matb33/meteor-collection-hooks#afterupdateuserid-doc-fieldnames-modifier-options
Games.hookOptions.after.update = { fetchPrevious: false };

Games.after.insert((userId, doc) => {
  Modules.server.seasonLeagueTeams.updateTeamStats(doc.leagueId, doc.seasonId, doc.homeTeamId);
  Modules.server.seasonLeagueTeams.updateTeamStats(doc.leagueId, doc.seasonId, doc.awayTeamId);
});

Games.after.update((userId, doc, fieldNames, modifier, options) => {
  Modules.server.seasonLeagueTeams.updateTeamStats(doc.leagueId, doc.seasonId, doc.homeTeamId);
  Modules.server.seasonLeagueTeams.updateTeamStats(doc.leagueId, doc.seasonId, doc.awayTeamId);
});
