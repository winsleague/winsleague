Template.poolShow.events({
});

Template.poolShow.helpers({
  poolUserTeams: () => {
    const poolId = FlowRouter.getParam('_id');
    return PoolUserTeams.find({ poolId })
  }
});

Template.poolShow.onCreated(function() {
  var self = this;
  self.autorun(function() {
    const poolId = FlowRouter.getParam('_id');
    self.subscribe('singlePool', poolId, function() {
      log.info(`singlePool subscription ready: ${PoolUserTeams.find().count()} teams`);
    });
  });
});

Template.poolShow.onRendered(function() {
});

Template.poolShow.onDestroyed(function() {
});
