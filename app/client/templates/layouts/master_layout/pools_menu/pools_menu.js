Template.poolsMenu.helpers({
  canShow() {
    return !!Meteor.user();
  },
  pools: () => { return Pools.find({}); },
});

Template.poolsMenu.onCreated(function() {
  this.autorun(() => {
    if (!!Meteor.user()) {
      this.subscribe('userPoolTeams', Meteor.userId(), () => {
        log.info(`userPoolTeams subscription ready: ${Pools.find({}).count()} pools`);
      });
    }
  });
});
