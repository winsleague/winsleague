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
      Modules.server.nbaGameData.ingestSeasonData();
    } catch (e) {
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
      Modules.server.mlbGameData.refreshStandings();
    } catch (e) {
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
      Modules.server.weeklyReport.emailReports();
    } catch (e) {
      handleError(e, {
        job: 'weeklyReport.emailReports()',
      });
    }
  },
});

if (! process.env.CI) { // https://circleci.com/docs/dont-run/
  SyncedCron.start();
}
