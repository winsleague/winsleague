Template.poolsEdit.helpers({
  poolId: () => Template.instance().getPoolId(),

  poolDoc: () => Template.instance().getPoolDoc(),

  onRemoveSuccess: () => {
    return () => {
      log.debug('onRemoveSuccess called');
      $('.modal-backdrop').hide(); // https://github.com/yogiben/meteor-autoform-modals/issues/65
      log.debug(`poolsEdit: onRemoveSuccess: redirect to /`);
      FlowRouter.go('/');
    };
  },
});

Template.poolsEdit.onCreated(function() {
  this.getPoolId = () => FlowRouter.getParam('_id');

  this.getPoolDoc = () => Pools.findOne(this.getPoolId());

  this.autorun(() => {
    this.subscribe('pools.single', this.getPoolId(), () => {
      log.debug(`pools.single subscription ready: ${Pools.find(this.getPoolId()).count()}`);
      if (Pools.find(this.getPoolId()).count() === 0) {
        log.warn('poolsEdit: Redirecting to / because Pools.count=0');
        FlowRouter.go('/');
      }
    });
  });
});


AutoForm.hooks({
  updatePoolForm: {
    onSuccess: (formType, result) => {
      log.debug(`redirect to poolsShow`, FlowRouter.getParam('_id'));
      return FlowRouter.go('poolsShow', { _id: FlowRouter.getParam('_id') });
    },
  },
});
