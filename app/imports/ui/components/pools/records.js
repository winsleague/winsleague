Template.poolsRecords.helpers({
  poolId: () => Template.instance().getPoolId(),

  poolName: () => _.get(Template.instance().getPool(), 'name'),
});

Template.poolsRecords.onCreated(function () {
  this.getPoolId = () => FlowRouter.getParam('poolId');

  this.getPool = () => Pools.findOne(this.getPoolId());

  this.autorun(() => {
    this.subscribe('pools.single', this.getPoolId(), () => {
      log.debug(`pools.single subscription ready: ${Pools.find(this.getPoolId()).count()}`);
      if (Pools.find(this.getPoolId()).count() === 0) {
        log.warn('poolsRecords: Redirecting to / because Pools.count=0');
        FlowRouter.go('/');
      }
    });
  });
});
