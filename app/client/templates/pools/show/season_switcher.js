Template.seasonSwitcher.helpers({
  poolId: () => Template.instance().getPoolId(),
  isLatestSeason: () => ! Template.instance().getSeasonId(),
  seasons: () => Seasons.find(),
  isMultipleSeasons: () => Seasons.find().count() > 1,
});

Template.seasonSwitcher.onCreated(function() {
  this.getPoolId = () => FlowRouter.getParam('_id');
  this.getSeasonId = () => FlowRouter.getParam('seasonId');

  this.autorun(() => {
    this.subscribe('seasons.of_pool', this.getPoolId(), () => {
      log.debug(`seasons.of_pool subscription ready: ${Seasons.find().count()}`);
    });
  });
});
