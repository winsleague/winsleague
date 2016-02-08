Meteor.publish('seasons.single', function(_id) {
  if (! _id) return this.ready();
  check(_id, String);
  return Seasons.find(_id);
});

Meteor.publish('seasons.of_pool', function(poolId) {
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
        year: { $first: '$seasonYear' },
      },
    },
  ],
    {
      observeSelector: { poolId },
      clientCollection: 'seasons',
    }
  );
});

