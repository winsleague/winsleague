Meteor.publish('seasons.list', () => Seasons.find());

Meteor.publish('seasons.of_pool', function(poolId) {
  check(poolId, String);

  var self = this;

  const seasons = PoolTeams.aggregate([
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
  ]);
  seasons.forEach(seasonObject => {
    const season = Seasons.findOne(seasonObject._id);
    self.added('seasons', season._id, season);
  });
  this.ready();
});

