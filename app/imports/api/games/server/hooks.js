import log from '../../../utils/log';

import { Games } from '../games';
import SeasonLeagueTeamUpdater from '../../season_league_teams/server/updater';

// performance improvement - https://github.com/matb33/meteor-collection-hooks#afterupdateuserid-doc-fieldnames-modifier-options
Games.hookOptions.after.update = { fetchPrevious: false };

Games.after.insert((userId, doc) => {
  SeasonLeagueTeamUpdater.updateTeamStats(doc.leagueId, doc.seasonId, doc.homeTeamId);
  SeasonLeagueTeamUpdater.updateTeamStats(doc.leagueId, doc.seasonId, doc.awayTeamId);
});

Games.after.update((userId, doc, fieldNames, modifier, options) => {
  SeasonLeagueTeamUpdater.updateTeamStats(doc.leagueId, doc.seasonId, doc.homeTeamId);
  SeasonLeagueTeamUpdater.updateTeamStats(doc.leagueId, doc.seasonId, doc.awayTeamId);
});
