import log from '../../../utils/log';

import { Games } from '../games';
import GameUpdater from './updater';
import SeasonLeagueTeamUpdater from '../../season_league_teams/server/updater';
import PoolTeamWeeksUpdater from '../../pool_team_weeks/server/updater';

// performance improvement - https://github.com/matb33/meteor-collection-hooks#afterupdateuserid-doc-fieldnames-modifier-options
Games.hookOptions.after.update = { fetchPrevious: false };

Games.after.insert((userId, doc) => {
  SeasonLeagueTeamUpdater.updateTeamStats(doc.leagueId, doc.seasonId, doc.homeTeamId);
  SeasonLeagueTeamUpdater.updateTeamStats(doc.leagueId, doc.seasonId, doc.awayTeamId);
});

Games.after.update((userId, doc, fieldNames, modifier, options) => {
  if (doc.status === 'completed') { // only update game when it's finished
    GameUpdater.updateWinner(doc);
    SeasonLeagueTeamUpdater.updateTeamStats(doc.leagueId, doc.seasonId, doc.homeTeamId);
    SeasonLeagueTeamUpdater.updateTeamStats(doc.leagueId, doc.seasonId, doc.awayTeamId);

    if (doc.week) {
      PoolTeamWeeksUpdater.updateLeagueTeam(doc.leagueId, doc.seasonId, doc.homeTeamId, week);
      PoolTeamWeeksUpdater.updateLeagueTeam(doc.leagueId, doc.seasonId, doc.awayTeamId, week);
    }
  }
});

Games.after.remove((userId, doc) => {
  SeasonLeagueTeamUpdater.updateTeamStats(doc.leagueId, doc.seasonId, doc.homeTeamId);
  SeasonLeagueTeamUpdater.updateTeamStats(doc.leagueId, doc.seasonId, doc.awayTeamId);
});
