Template.poolsMenu.helpers({
  canShow() {
    return !!Meteor.user();
  },
  pools: () => { return Pools.find({}); },
});

Template.poolsMenu.onCreated(function() {
  this.autorun(() => {
    this.subscribe('userPools', Meteor.userId(), () => {
      log.info(`userPools subscription ready: ${Pools.find({}).count()} pools`);
    });
  });
});
