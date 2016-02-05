Template.poolsMenu.helpers({
  canShow() {
    return !!Meteor.user();
  },
  pools: () => { return Pools.find({}); },
});

Template.poolsMenu.onCreated(function() {
  this.autorun(() => {
    this.subscribe('pools.of_user', Meteor.userId(), () => {
      log.info(`pools.of_user subscription ready: ${Pools.find({}).count()} pools`);
    });
  });
});
