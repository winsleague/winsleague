import { Meteor } from 'meteor/meteor';
import { SyncedCron } from 'meteor/percolate:synced-cron';
import log from '../../utils/log';

import NbaGameData from '../../api/games/server/nba_game_data';
import MlbGameData from '../../api/games/server/mlb_game_data';

import WeeklyReport from '../../api/reports/server/weekly-report';

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
        job: 'nbaGameData.ingestSeasonData()',
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
        job: 'mlbGameData.refreshStandings()',
      });
    }
  },
});

SyncedCron.add({
  name: 'Send weekly emails',
  schedule(parser) {
    return parser.text('at 1:00 pm on Tuesday');
  },
  job() {
    try {
      WeeklyReport.emailReports();
    } catch (e) {
      log.error(e);
      handleError(e, {
        job: 'weeklyReport.emailReports()',
      });
    }
  },
});

if (! Meteor.isTest) {
  SyncedCron.start();
}
