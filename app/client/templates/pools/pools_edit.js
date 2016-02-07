Template.poolsEdit.events({
});

Template.poolsEdit.helpers({
  poolId: () => Template.instance().getPoolId(),
  poolDoc: () => Template.instance().getPoolDoc(),
});

Template.poolsEdit.onCreated(function() {
  this.getPoolId = () => FlowRouter.getParam('_id');
  this.getPoolDoc = () => Pools.findOne(this.getPoolId());

  this.autorun(() => {
    this.subscribe('pools.single', this.getPoolId(), () => {
      log.info(`pools.single subscription ready: ${Pools.find().count()} pools`);
    });
  });
});

Template.poolsEdit.onRendered(function() {
});

Template.poolsEdit.onDestroyed(function() {
});


AutoForm.hooks({
  updatePoolForm: {
    onSuccess: (operation, doc) => {
      FlowRouter.go('poolsShow', { _id: FlowRouter.getParam('_id') });
    },
  },
});
