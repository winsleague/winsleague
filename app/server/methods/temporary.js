Meteor.methods({
  'mlbGameData.ingestSeasonData': Modules.server.mlbGameData.ingestSeasonData,
  'seeds.insertNflExpectedWins': Modules.server.seeds.insertNflExpectedWins,
});
