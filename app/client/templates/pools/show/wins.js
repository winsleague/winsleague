Template.poolsShowWins.helpers({
  poolId: () => Template.instance().getPoolId(),

  seasonId: () => Template.instance().getSeasonId(),

  poolTeams: () => {
    const poolId = Template.instance().getPoolId();
    return PoolTeams.find({ poolId }, { sort: { totalWins: -1, totalPlusMinus: -1 } });
  },

  editAllowed: (poolTeam) => {
    const pool = Pools.findOne(poolTeam.poolId);
    return (Meteor.userId() === poolTeam.userId ||
    Meteor.userId() === _.get(pool, 'commissionerUserId'));
  },
});

Template.poolsShowWins.onCreated(function() {
  this.getPoolId = () => FlowRouter.getParam('poolId');

  this.getPool = () => Pools.findOne(this.getPoolId());

  this.getLeagueId = () => _.get(this.getPool(), 'leagueId');

  this.getSeasonId = () => {
    const seasonId = FlowRouter.getParam('seasonId');
    if (seasonId) return seasonId;
    const season = Modules.seasons.getLatestByLeagueId(this.getLeagueId());
    return _.get(season, '_id');
  };

  this.autorun(() => {
    this.subscribe('pools.single', this.getPoolId(), () => {
      log.debug(`pools.single subscription ready: ${Pools.find(this.getPoolId()).count()}`);
    });

    this.subscribe('poolTeams.ofPool', this.getPoolId(), this.getSeasonId(), () => {
      log.debug(`poolTeams.of_pool subscription ready: ${PoolTeams.find().count()}`);
    });
  });
});
