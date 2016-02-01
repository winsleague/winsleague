SyncedCron.add({
  name: 'Refresh NBA standings',
  schedule(parser) {
    // parser is a later.parse object
    return parser.recur().on(2).hour(); // every 2am
  },
  job() {
    Modules.server.nbaGameData.ingestSeasonData();
  },
});

SyncedCron.start();
