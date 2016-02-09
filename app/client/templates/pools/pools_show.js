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

  isLatestSeason: () => ! Template.instance().getSeasonId(),

  seasonYear: () => {
    const poolTeam = PoolTeams.findOne();
    if (poolTeam) {
      // just pick seasonYear from one of the PoolTeams
      return poolTeam.seasonYear;
    } else {
      // no pool teams exist, so pick latest year
      return Seasons.findOne().year;
    }
  },
});

Template.poolsShow.onCreated(function() {
  this.getPoolId = () => FlowRouter.getParam('_id');

  this.getPool = () => Pools.findOne(this.getPoolId());

  this.getLeagueId = () => _.get(this.getPool(), 'leagueId');

  this.getSeasonId = () => FlowRouter.getParam('seasonId');

  this.autorun(() => {
    this.subscribe('pools.single', this.getPoolId(), () => {
      log.debug(`pools.single subscription ready: ${Pools.find(this.getPoolId()).count()}`);
      if (Pools.find(this.getPoolId()).count() === 0) FlowRouter.go('/');
    });

    this.subscribe('poolTeams.ofPool', this.getPoolId(), this.getSeasonId(), () => {
      log.debug(`poolTeams.of_pool subscription ready: ${PoolTeams.find().count()}`);
    });

    this.subscribe('seasons.single', this.getSeasonId());

    this.subscribe('seasons.latest.ofLeague', this.getLeagueId());
  });
});
