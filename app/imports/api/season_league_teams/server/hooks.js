import { SeasonLeagueTeams } from '../season_league_teams';

import PoolTeamMethods from '../../pool_teams/server/methods';

// performance improvement - https://github.com/matb33/meteor-collection-hooks#afterupdateuserid-doc-fieldnames-modifier-options
SeasonLeagueTeams.hookOptions.after.update = { fetchPrevious: false };

SeasonLeagueTeams.after.insert(function (userId, doc) {
  PoolTeamMethods.updateWhoPickedLeagueTeam(doc.leagueTeamId);
});

SeasonLeagueTeams.after.update(function (userId, doc, fieldNames, modifier, options) {
  PoolTeamMethods.updateWhoPickedLeagueTeam(doc.leagueTeamId);
});


