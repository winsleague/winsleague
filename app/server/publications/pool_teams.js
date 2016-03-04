Meteor.publish('poolTeams.ofPool', function (poolId, seasonId = null) {
  if (!poolId) return this.ready();
  check(poolId, String);

  if (seasonId) {
    check(seasonId, String);
    return PoolTeams.find({ poolId, seasonId });
  } else {
    return PoolTeams.find({ poolId });
  }
});

Meteor.publish('poolTeams.single', function (_id) {
  if (!_id) return this.ready();
  check(_id, String);
  return PoolTeams.find(_id);
});

Meteor.publish('poolUsersMostAllTime.ofPool', function(poolId, field, collectionName) {
  ReactiveAggregate(this, PoolTeams, [
    {
      $match: {
        poolId: poolId,
      },
    },
    {
      $group: {
        _id: '$userId',
        userTeamName: {
          $first: '$userTeamName',
        },
        metric: {
          // In this case, we're running summation.
          $sum: `$${field}`,
        },
      },
    },
  ],
    {
      observeSelector: { poolId }, // only observe PoolTeams for this pool (perf reasons)
      clientCollection: collectionName,
    }
  );
});
