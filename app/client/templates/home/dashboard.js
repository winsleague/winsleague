Template.dashboard.helpers({
  pools: () => Pools.find({}, { sort: { updatedAt: 1 } }),

  poolNameLink: (pool) => `<a href="/pools/${pool._id}">${pool.name}</a>`,
});

Template.dashboard.onCreated(function () {
  this.autorun(() => {
    this.subscribe('pools.ofUser', Meteor.userId(), () => {
      log.debug(`pools.of_user subscription ready: ${Pools.find().count()} pools`);
    });
  });
});
