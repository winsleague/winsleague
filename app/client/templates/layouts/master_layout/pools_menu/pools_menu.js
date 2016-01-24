Template.poolsMenu.helpers({
  canShow() {
    return !!Meteor.user();
  },
  pools: () => { return Pools.find({}); },
});

Template.poolsMenu.onCreated(function() {
  this.autorun(() => {
    this.subscribe('userPoolTeams', Meteor.userId(), () => {
      log.info(`userPoolTeams subscription ready: ${Pools.find({}).count()} pools`);
    });
  });
});
