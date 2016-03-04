Meteor.publish('seasons.single', function(_id) {
  if (! _id) return this.ready();
  check(_id, String);
  return Seasons.find(_id);
});

Meteor.publish('seasons.latest.ofLeague', function(leagueId) {
  if (! leagueId) return this.ready();
  check(leagueId, String);
  return Modules.seasons.getLatestCursorByLeagueId(leagueId);
});


Meteor.publish('seasons.ofPool', function(poolId) {
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
      observeSelector: { poolId }, // only observe PoolTeams for this pool (perf reasons)
      clientCollection: 'seasons',
    }
  );
});

