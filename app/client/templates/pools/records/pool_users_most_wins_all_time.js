Template.poolsRecordsPoolUsersMostWinsAllTime.helpers({
  poolId: () => Template.instance().getPoolId(),

  poolUsers: () => {
    return PoolUsersMostWinsAllTime.find({}, { sort: { wins: -1 } });
  },
});

Template.poolsRecordsPoolUsersMostWinsAllTime.onCreated(function() {
  this.getPoolId = () => FlowRouter.getParam('_id');

  this.autorun(() => {
    this.subscribe('poolUsersMostWinsAllTime.ofPool', this.getPoolId(), () => {
      log.debug(`poolUsersMostWinsAllTime.of_pool subscription ready: ${PoolUsersMostWinsAllTime.find().count()}`);
    });
  });
});
