Template.poolsEdit.events({
});

Template.poolsEdit.helpers({
  poolId: () => Template.instance().getPoolId(),
  poolDoc: () => Template.instance().getPoolDoc(),
  onRemoveSuccess() {
    return function (result) {
      alert("Pool deleted!");
      FlowRouter.go('/');
    };
  },
  beforeRemove() {
    return function (collection, id) {
      const doc = collection.findOne(id);
      if (confirm('Really delete "' + doc.name + '"?')) {
        this.remove();
      }
    };
  },
});

Template.poolsEdit.onCreated(function() {
  this.getPoolId = () => FlowRouter.getParam('_id');
  this.getPoolDoc = () => Pools.findOne(this.getPoolId());

  this.autorun(() => {
    this.subscribe('pools.single', this.getPoolId(), () => {
      log.debug(`pools.single subscription ready: ${Pools.find().count()} pools`);
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
