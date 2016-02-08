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
    this.subscribe('seasonIds.of_pool', this.getPoolId(), () => {
      log.debug(`seasonIds.of_pool subscription ready: ${SeasonIds.find().count()}`);
      SeasonIds.find().forEach(season => {
        log.debug(`subscribe to `, season);
        this.subscribe('seasons.single', season._id);
      });
    });
  });
});
