/* eslint-disable prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';

import { PoolGameInterestRatings } from '../pool_game_interest_ratings';

Meteor.publish('poolGameInterestRatings.ofPool', function poolGameInterestRatingsOfPool(poolId) {
  check(poolId, String);
  if (!poolId) return this.ready();

  return PoolGameInterestRatings.find(
    {
      poolId,
      rating: {
        $gte: 50,
      },
    },
    {
      limit: 5,
    });
});
