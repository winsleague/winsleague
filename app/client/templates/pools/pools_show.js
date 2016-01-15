Template.poolsShow.events({
});

Template.poolsShow.helpers({
  poolTeams: () => {
    const poolId = FlowRouter.getParam('_id');
    return PoolTeams.find({ poolId });
  },
  poolId: () => {
    return FlowRouter.getParam('_id');
  }
});

Template.poolsShow.onCreated(function() {
  var self = this;
  self.autorun(function() {
    const poolId = FlowRouter.getParam('_id');
    self.subscribe('singlePool', poolId, function() {
      log.info(`singlePool subscription ready: ${PoolTeams.find().count()} teams`);
    });
  });
});

Template.poolsShow.onRendered(function() {
});

Template.poolsShow.onDestroyed(function() {
});
