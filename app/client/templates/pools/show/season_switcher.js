Template.seasonSwitcher.helpers({
  poolId: () => Template.instance().getPoolId(),

  seasons: () => Seasons.find(),

  isMultipleSeasons: () => Seasons.find().count() > 1,
});

Template.seasonSwitcher.onCreated(function() {
  this.getPoolId = () => FlowRouter.getParam('_id');

  this.getSeasonId = () => FlowRouter.getParam('seasonId');

  this.autorun(() => {
    this.subscribe('seasons.ofPool', this.getPoolId(), () => {
      log.debug(`seasons.of_pool subscription ready: ${Seasons.find().count()}`);
    });
  });
});
