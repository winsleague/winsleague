Template.poolsMenu.helpers({
  canShow: () => !!Meteor.user(),

  pools: () => Pools.find(),
});

Template.poolsMenu.onCreated(function() {
  this.autorun(() => {
    this.subscribe('pools.ofUser', Meteor.userId(), () => {
      log.debug(`pools.of_user subscription ready: ${Pools.find().count()} pools`);
    });
  });
});
