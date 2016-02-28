Template.seasonSwitcher.helpers({
  poolId: () => Template.instance().getPoolId(),

  seasons: () => Seasons.find({}, { sort: { year: -1 } }),

  isMultipleSeasons: () => Seasons.find().count() > 1,
});

Template.seasonSwitcher.onCreated(function() {
  this.getPoolId = () => FlowRouter.getParam('poolId');

  this.getSeasonId = () => FlowRouter.getParam('seasonId');

  this.autorun(() => {
    this.subscribe('seasons.ofPool', this.getPoolId(), () => {
      log.debug(`seasons.of_pool subscription ready: ${Seasons.find().count()}`);
    });
  });
});
