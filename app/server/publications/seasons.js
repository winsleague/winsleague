Meteor.publish('seasons.list', () => Seasons.find());

Meteor.publish('seasons.single', seasonId => {
  check(seasonId, String);
  return Seasons.find(seasonId);
});

Meteor.publish('seasonIds.of_pool', function(poolId) {
  check(poolId, String);

  ReactiveAggregate(this, PoolTeams, [
    {
      $match: {
        poolId: poolId,
      },
    },
    {
      $group: {
        _id: '$seasonId',
      },
    },
  ],
    {
      observeSelector: { poolId },
      clientCollection: 'season_ids',
    }
  );
});

