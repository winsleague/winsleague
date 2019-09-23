import { Template } from 'meteor/templating';
import SimpleSchema from 'simpl-schema';
import log from '../../utils/log';

import { Seasons } from '../../api/seasons/seasons';

import './pools-season-switcher.html';

Template.Pools_season_switcher.helpers({
  seasons: () => Seasons.find(
    {},
    {
      sort: {
        year: -1,
      },
    },
  ),

  isMultipleSeasons: () => Seasons.find().count() > 1,
});

Template.Pools_season_switcher.onCreated(function () {
  new SimpleSchema({
    poolId: { type: String },
  }).validate(this.data);

  this.autorun(() => {
    this.subscribe('seasons.ofPool', this.data.poolId, () => {
      log.debug(`seasons.of_pool subscription ready: ${Seasons.find().count()}`);
    });
  });
});
