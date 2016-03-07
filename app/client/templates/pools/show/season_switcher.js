Template.seasonSwitcher.helpers({
  seasons: () => Seasons.find({}, { sort: { year: -1 } }),

  isMultipleSeasons: () => Seasons.find().count() > 1,
});

Template.seasonSwitcher.onCreated(function () {
  new SimpleSchema({
    poolId: { type: String },
  }).validate(this.data);

  this.autorun(() => {
    this.subscribe('seasons.ofPool', this.data.poolId, () => {
      log.debug(`seasons.of_pool subscription ready: ${Seasons.find().count()}`);
    });
  });
});
