Template.poolsShow.events({
});

Template.poolsShow.helpers({
  poolTeams: () => {
    const instance = Template.instance();
    const poolId = instance.getPoolId();
    return PoolTeams.find({ poolId });
  },
  poolId: () => {
    const instance = Template.instance();
    return instance.getPoolId();
  },
});

Template.poolsShow.onCreated(function() {
  this.getPoolId = () => FlowRouter.getParam('_id');

  this.autorun(() => {
    this.subscribe('pools.single', this.getPoolId(), () => {
      log.info(`pools.single subscription ready: ${Pools.find().count()} pools`);
    });
    this.subscribe('poolTeams.of_pool', this.getPoolId(), () => {
      log.info(`poolTeams subscription ready: ${PoolTeams.find().count()} teams`);
    });
  });
});

Template.poolsShow.onRendered(function() {
});

Template.poolsShow.onDestroyed(function() {
});
