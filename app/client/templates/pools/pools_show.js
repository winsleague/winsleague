Template.poolsShow.helpers({
  poolId: () => Template.instance().getPoolId(),
  poolName: () => Template.instance().getPool().name,
  poolTeams: () => {
    const poolId = Template.instance().getPoolId();
    return PoolTeams.find({ poolId });
  },
  isCommissioner: () => Meteor.userId() === Template.instance().getPool().commissionerUserId,
  editAllowed: (poolTeam) => {
    const pool = Pools.findOne(poolTeam.poolId);
    return (Meteor.userId() === poolTeam.userId ||
      Meteor.userId() === pool.commissionerUserId);
  },
  seasonYear: () => {
    let season;
    if (Template.instance().getSeasonId()) {
      season = Seasons.findOne(Template.instance().getSeasonId());
    } else {
      season = Modules.seasons.getLatestByLeagueId(Template.instance().getPool().leagueId);
    }
    return season.year;
  },
});

Template.poolsShow.onCreated(function() {
  this.getPoolId = () => FlowRouter.getParam('_id');
  this.getPool = () => Pools.findOne(this.getPoolId());
  this.getSeasonId = () => FlowRouter.getParam('seasonId');

  this.autorun(() => {
    this.subscribe('pools.single', this.getPoolId(), () => {
      log.debug(`pools.single subscription ready: ${Pools.find(this.getPoolId()).count()}`);
      if (Pools.find(this.getPoolId()).count() === 0) FlowRouter.go('/');
    });
    this.subscribe('poolTeams.of_pool', this.getPoolId(), this.getSeasonId(), () => {
      log.debug(`poolTeams.of_pool subscription ready: ${PoolTeams.find().count()}`);
    });
    this.subscribe('seasons.of_pool', this.getPoolId(), () => {
      log.debug(`seasons.of_pool subscription ready: ${Seasons.find().count()}`);
    });
  });
});
