import { Meteor } from 'meteor/meteor';
import { SyncedCron } from 'meteor/percolate:synced-cron';
import log from '../../utils/log';

import NflGameData from '../../api/games/server/nfl_game_data';
import NbaGameData from '../../api/games/server/nba_game_data';
import MlbGameData from '../../api/games/server/mlb_game_data';

import WeeklyLeaderboardEmail from '../../api/emails/server/weekly-leaderboard-email';
import WeeklyGamesToWatchEmail from '../../api/emails/server/weekly-games-to-watch';

if (!Meteor.isTest && !Meteor.isAppTest) {
  log.info('Initializing SyncedCron');

  const SyncedCronLogger = opts => {
    log.log(opts.level, `${opts.tag}: ${opts.message}`);
  };

  SyncedCron.config({
    logger: SyncedCronLogger,
    utc: true,
  });

  // parser is a later.parse object
  // we catch exceptions so we can report them to Rollbar

  SyncedCron.add({
    name: 'Refresh NFL standings',
    schedule(parser) {
      return parser.recur().every(10).minute();
    },
    job() {
      try {
        NflGameData.updateLiveScores();
      } catch (e) {
        log.error(e);
        handleError(e, {
          job: 'NflGameData.updateLiveScores()',
        });
      }
    },
  });

  SyncedCron.add({
    name: 'Refresh NBA standings',
    schedule(parser) {
      return parser.recur().on(12).hour();
    },
    job() {
      try {
        NbaGameData.ingestSeasonData();
      } catch (e) {
        log.error(e);
        handleError(e, {
          job: 'NbaGameData.ingestSeasonData()',
        });
      }
    },
  });

  SyncedCron.add({
    name: 'Refresh MLB standings',
    schedule(parser) {
      return parser.recur().every(10).minute();
    },
    job() {
      try {
        MlbGameData.refreshStandings();
      } catch (e) {
        log.error(e);
        handleError(e, {
          job: 'MlbGameData.refreshStandings()',
        });
      }
    },
  });

  SyncedCron.add({
    name: 'Send weekly leaderboard emails',
    schedule(parser) {
      return parser.text('at 6:00 am on Tuesday');
    },
    job() {
      try {
        WeeklyLeaderboardEmail.sendAll();
      } catch (e) {
        log.error(e);
        handleError(e, {
          job: 'WeeklyLeaderboardEmail.sendAll()',
        });
      }
    },
  });

  SyncedCron.add({
    name: 'Send weekly games to watch emails',
    schedule(parser) {
      return parser.text('at 5:00 pm on Wednesday');
    },
    job() {
      try {
        WeeklyGamesToWatchEmail.sendAll();
      } catch (e) {
        log.error(e);
        handleError(e, {
          job: 'WeeklyGamesToWatchEmail.sendAll()',
        });
      }
    },
  });

  SyncedCron.start();
}
