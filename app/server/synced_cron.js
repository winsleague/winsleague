SyncedCron.add({
  name: 'Refresh NBA standings',
  schedule(parser) {
    // parser is a later.parse object
    return parser.text('every 1 minute');
  },
  job() {
    Modules.server.nbaGameData.ingestSeasonData();
  },
});

SyncedCron.start();
