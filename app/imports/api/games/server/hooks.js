import { Games } from '../games';
import SeasonLeagueTeamMethods from '../../season_league_teams/server/methods';

// performance improvement - https://github.com/matb33/meteor-collection-hooks#afterupdateuserid-doc-fieldnames-modifier-options
Games.hookOptions.after.update = { fetchPrevious: false };

Games.after.insert((userId, doc) => {
  SeasonLeagueTeamMethods.updateTeamStats(doc.leagueId, doc.seasonId, doc.homeTeamId);
  SeasonLeagueTeamMethods.updateTeamStats(doc.leagueId, doc.seasonId, doc.awayTeamId);
});

Games.after.update((userId, doc, fieldNames, modifier, options) => {
  SeasonLeagueTeamMethods.updateTeamStats(doc.leagueId, doc.seasonId, doc.homeTeamId);
  SeasonLeagueTeamMethods.updateTeamStats(doc.leagueId, doc.seasonId, doc.awayTeamId);
});
