/* eslint-disable prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';

import { PoolTeams } from '../pool_teams';

Meteor.publish('poolTeams.ofPool', function poolTeamsOfPool(poolId, seasonId = null) {
  check(poolId, String);
  check(seasonId, Match.Maybe(String));
  if (!poolId) return this.ready();

  if (seasonId) {
    check(seasonId, String);
    return PoolTeams.find({ poolId, seasonId });
  } else {
    return PoolTeams.find({ poolId });
  }
});

Meteor.publish('poolTeams.single', function poolTeamsSingle(_id) {
  if (!_id) return this.ready();
  check(_id, String);
  return PoolTeams.find(_id);
});

Meteor.publish('poolUsersMostAllTime.ofPool', function poolUsersMostAllTimeOfPool(poolId, field, collectionName) {
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
