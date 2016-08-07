/* eslint-disable prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { ReactiveAggregate } from 'meteor/jcbernack:reactive-aggregate';

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
  check(_id, Match.Maybe(String));
  if (!_id) return this.ready();
  return PoolTeams.find(_id);
});

Meteor.publish('poolUsersMostAllTime.ofPool', function poolUsersMostAllTimeOfPool(
  poolId, field, collectionName) {

  check(poolId, String);
  check(field, String);
  check(collectionName, String);

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
