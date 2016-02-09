Template.poolsMenu.helpers({
  canShow() {
    return !!Meteor.user();
  },
  pools: () => { return Pools.find(); },
});

Template.poolsMenu.onCreated(function() {
  this.autorun(() => {
    this.subscribe('pools.ofUser', Meteor.userId(), () => {
      log.debug(`pools.of_user subscription ready: ${Pools.find().count()} pools`);
    });
  });
});
