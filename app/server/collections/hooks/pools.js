Pools.before.remove((userId, doc) => {
  PoolTeams.remove({ poolId: doc._id });
});
