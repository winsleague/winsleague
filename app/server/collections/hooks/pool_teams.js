PoolTeams.before.remove((userId, doc) => {
  PoolTeamPicks.remove({ poolTeamId: doc._id });
});
