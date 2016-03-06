log.info('Initializing SyncedCron');

const SyncedCronLogger = opts => {
  log.log(opts.level, `${opts.tag}: ${opts.message}`);
};

SyncedCron.config({
  logger: SyncedCronLogger,
  utc: true,
});

// parser is a later.parse object

SyncedCron.add({
  name: 'Refresh NBA standings',
  schedule(parser) {
    return parser.recur().on(12).hour();
  },
  job() {
    Modules.server.nbaGameData.ingestSeasonData();
  },
});

SyncedCron.add({
  name: 'Refresh MLB standings',
  schedule(parser) {
    return parser.recur().every(1).hour();
  },
  job() {
    Modules.server.mlbGameData.refreshStandings();
  },
});

SyncedCron.add({
  name: 'Send weekly emails',
  schedule(parser) {
    return parser.text('at 1:00 pm on Tuesday');
  },
  job() {
    Modules.server.weeklyReport.emailReports();
  },
});

SyncedCron.start();
