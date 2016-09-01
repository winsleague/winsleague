import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { _ } from 'lodash';
import log from '../../utils/log';

import { PoolGameInterestRatings } from '../../api/pool_game_interest_ratings/pool_game_interest_ratings';

import './pools-games-to-watch.html';

Template.Pools_games_to_watch.helpers({
  poolGameInterestRatings: () => {
    const poolId = Template.currentData().poolId;
    return PoolGameInterestRatings.find({ poolId }, {
      sort: {
        rating: -1,
      },
    });
  },
});

Template.Pools_games_to_watch.onCreated(function () {
  new SimpleSchema({
    poolId: { type: String },
  }).validate(this.data);

  this.autorun(() => {
    this.subscribe('poolGameInterestRatings.ofPool', this.data.poolId, () => {
      log.debug(`poolGameInterestRatings.of_pool subscription ready: ${PoolGameInterestRatings.find().count()}`);
    });
  });
});
