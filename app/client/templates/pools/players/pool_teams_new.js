Template.poolTeamsNew.events({
});

Template.poolTeamsNew.helpers({
  leagueId: () => {
    const instance = Template.instance();
    return instance.getPool().leagueId;
  },
  seasonId: () => {
    const instance = Template.instance();
    return instance.getPool().seasonId;
  }
});

Template.poolTeamsNew.onCreated(function() {
  this.getPoolId = () => FlowRouter.getParam('poolId');
  this.getPool = () => Pools.findOne({ _id: this.getPoolId() });

  this.autorun(() => {
    this.subscribe('singlePool', this.getPoolId(), () => {
      log.info(`singlePool subscription ready: ${Pools.find().count()} pools`);
    });
  });
});

Template.poolTeamsNew.onRendered(() => {
});

Template.poolTeamsNew.onDestroyed(() => {
});


AutoForm.hooks({
  insertPoolPlayerForm: {
    onSuccess: (operation, poolId) => {
      FlowRouter.go("poolsShow", { _id: poolId });
    }
  }
});
