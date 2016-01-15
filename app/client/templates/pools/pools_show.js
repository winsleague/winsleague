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
  }
});

Template.poolsShow.onCreated(function() {
  this.getPoolId = () => FlowRouter.getParam('_id');

  this.autorun(() => {
    this.subscribe('singlePool', this.getPoolId(), () => {
      log.info(`singlePool subscription ready: ${Pools.find().count()} pools`);
    });
    this.subscribe('poolTeams', this.getPoolId(), () => {
      log.info(`poolTeams subscription ready: ${PoolTeams.find().count()} teams`);
    });
  });
});

Template.poolsShow.onRendered(function() {
});

Template.poolsShow.onDestroyed(function() {
});
