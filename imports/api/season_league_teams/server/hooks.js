import { SeasonLeagueTeams } from '../season_league_teams';
import PoolTeamUpdater from '../../pool_teams/server/updater';

// performance improvement
// https://github.com/matb33/meteor-collection-hooks#afterupdateuserid-doc-fieldnames-modifier-options
SeasonLeagueTeams.hookOptions.after.update = { fetchPrevious: false };

SeasonLeagueTeams.after.insert(function (userId, doc) {
  PoolTeamUpdater.updateWhoPickedLeagueTeam(doc.seasonId, doc.leagueTeamId);
});

SeasonLeagueTeams.after.update(function (userId, doc, fieldNames, modifier, options) {
  PoolTeamUpdater.updateWhoPickedLeagueTeam(doc.seasonId, doc.leagueTeamId);
});
