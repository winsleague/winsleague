Template.poolsEdit.helpers({
  poolId: () => Template.instance().getPoolId(),

  poolDoc: () => Template.instance().getPoolDoc(),

  onRemoveSuccess: () => {
    // check to see if doc exists because of https://github.com/yogiben/meteor-autoform-modals/issues/79
    if (! Template.instance().getPoolDoc()) {
      $('.modal-backdrop').hide(); // https://github.com/yogiben/meteor-autoform-modals/issues/65
      FlowRouter.go('/');
    }
  },
});

Template.poolsEdit.onCreated(function() {
  this.getPoolId = () => FlowRouter.getParam('_id');

  this.getPoolDoc = () => Pools.findOne(this.getPoolId());

  this.autorun(() => {
    this.subscribe('pools.single', this.getPoolId(), () => {
      log.debug(`pools.single subscription ready: ${Pools.find(this.getPoolId()).count()}`);
      if (Pools.find(this.getPoolId()).count() === 0) FlowRouter.go('/');
    });
  });
});


AutoForm.hooks({
  updatePoolForm: {
    onSuccess: (formType, result) => {
      FlowRouter.go('poolsShow', { _id: FlowRouter.getParam('_id') });
    },
  },
});
