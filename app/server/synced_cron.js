log.info('Initializing SyncedCron');

const SyncedCronLogger = opts => {
  log.log(opts.level, `${opts.tag}: ${opts.message}`);
};

SyncedCron.config({
  logger: SyncedCronLogger,
});

SyncedCron.add({
  name: 'Refresh NBA standings',
  schedule(parser) {
    // parser is a later.parse object
    return parser.recur().on(5).hour(); // every 5am (just in case this runs ET)
  },
  job() {
    Modules.server.nbaGameData.ingestSeasonData();
  },
});

SyncedCron.start();
