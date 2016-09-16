import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Games } from '../../api/games/games';

import './pools-my-games.html';

Template.Pools_my_games.helpers({
  myGames: () => {
    const poolId = Template.currentData().poolId;
    return Games.find({}, {
      sort: {
        gameDate: 1,
      },
    });
  },
});

Template.Pools_my_games.onCreated(function () {
  new SimpleSchema({
    poolId: { type: String },
  }).validate(this.data);

  this.autorun(() => {
    this.subscribe('poolGameInterestRatings.ofPool', this.data.poolId, () => {
      log.debug(`poolGameInterestRatings.of_pool subscription ready: ${Games.find().count()}`);
    });
  });
});
