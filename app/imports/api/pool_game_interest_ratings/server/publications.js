/* eslint-disable prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import 'meteor/reywood:publish-composite';

import { PoolGameInterestRatings } from '../pool_game_interest_ratings';
import { Games } from '../../games/games';

Meteor.publishComposite('poolGameInterestRatings.ofPool', function poolGameInterestRatingsOfPool(poolId) {
  check(poolId, String);
  if (!poolId) {
    return this.ready();
  }

  return {
    find() {
      return PoolGameInterestRatings.find(
        {
          poolId,
          rating: {
            $gte: 50,
          },
        },
        {
          sort: {
            rating: -1,
          },
          limit: 5,
        });
    },
    children: [{
      find(poolGameInterestRating) {
        return Games.find({ _id: poolGameInterestRating.gameId });
      },
    }],
  };
});
