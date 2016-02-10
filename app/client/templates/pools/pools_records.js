Template.poolsRecords.helpers({
  poolId: () => Template.instance().getPoolId(),

  poolName: () => _.get(Template.instance().getPool(), 'name'),

  poolTeamsMostWinsAllTime: () => {
    return PoolTeamsMostWinsAllTime.find({}, { sort: { wins: -1 } });
  },
});

Template.poolsRecords.onCreated(function() {
  this.getPoolId = () => FlowRouter.getParam('_id');

  this.getPool = () => Pools.findOne(this.getPoolId());

  this.autorun(() => {
    this.subscribe('pools.single', this.getPoolId(), () => {
      log.debug(`pools.single subscription ready: ${Pools.find(this.getPoolId()).count()}`);
      if (Pools.find(this.getPoolId()).count() === 0) FlowRouter.go('/');
    });

    this.subscribe('poolTeams.ofPool', this.getPoolId(), () => {
      log.debug(`poolTeams.of_pool subscription ready: ${PoolTeams.find().count()}`);
    });

    this.subscribe('poolTeamsMostWinsAllTime.ofPool', this.getPoolId(), () => {
      log.debug(`poolTeamsMostWinsAllTime.of_pool subscription ready: ${PoolTeamsMostWinsAllTime.find().count()}`);
    });
  });
});
