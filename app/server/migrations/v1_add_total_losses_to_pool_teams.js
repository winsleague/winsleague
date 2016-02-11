Migrations.add({
  version: 1,
  name: 'Adds totalLosses field to PoolTeams and populates it',
  up: () => {
    PoolTeams.find().forEach(poolTeam => {
      Modules.server.poolTeams.refreshPoolTeam(poolTeam);
    });
  },
  down: () => {
    PoolTeams.update({}, { $unset: { totalLosses: '' } }, { multi: true });
  },
});
