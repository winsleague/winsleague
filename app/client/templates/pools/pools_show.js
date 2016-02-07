Template.poolsShow.events({
});

Template.poolsShow.helpers({
  poolTeams: () => {
    const poolId = Template.instance().getPoolId();
    return PoolTeams.find({ poolId });
  },
  poolId: () => Template.instance().getPoolId(),
  isCommissioner: () => Meteor.userId() === Template.instance().getPool().commissionerUserId,
  editAllowed: (poolTeam) => {
    const pool = Pools.findOne({ _id: poolTeam.poolId });
    return (Meteor.userId() === poolTeam.userId ||
      Meteor.userId() === pool.commissionerUserId);
  },
});

Template.poolsShow.onCreated(function() {
  this.getPoolId = () => FlowRouter.getParam('_id');
  this.getPool = () => Pools.findOne({ _id: this.getPoolId() });

  this.autorun(() => {
    this.subscribe('pools.single', this.getPoolId(), () => {
      log.info(`pools.single subscription ready: ${Pools.find().count()} pools`);
    });
    this.subscribe('poolTeams.of_pool', this.getPoolId(), () => {
      log.info(`poolTeams subscription ready: ${PoolTeams.find().count()} teams`);
    });
  });
});

Template.poolsShow.onRendered(function() {
});

Template.poolsShow.onDestroyed(function() {
});
