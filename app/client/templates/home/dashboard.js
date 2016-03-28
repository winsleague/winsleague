Template.dashboard.helpers({
  pools: () => Pools.find(),
});

Template.dashboard.onCreated(function () {
  this.autorun(() => {
    this.subscribe('pools.ofUser', Meteor.userId(), () => {
      log.debug(`pools.of_user subscription ready: ${Pools.find().count()} pools`);
    });
  });
});
