Template.poolsShow.helpers({
  poolId: () => Template.instance().getPoolId(),

  seasonId: () => Template.instance().getSeasonId(),

  leagueId: () => Template.instance().getLeagueId(),

  isCommissioner: () => Meteor.userId() === _.get(Template.instance().getPool(), 'commissionerUserId'),

  isLatestSeason: () => {
    if (Template.instance().getSeasonId()) {
      const latestSeason = Modules.seasons.getLatestByLeagueId(Template.instance().getLeagueId());
      return _.get(latestSeason, '_id') === Template.instance().getSeasonId();
    } else {
      return true;
    }
  },
});

Template.poolsShow.onCreated(function () {
  this.getPoolId = () => FlowRouter.getParam('poolId');

  this.getPool = () => Pools.findOne(this.getPoolId());

  this.getLeagueId = () => _.get(this.getPool(), 'leagueId');

  this.getSeasonId = () => {
    const seasonId = FlowRouter.getParam('seasonId');
    if (seasonId) return seasonId;
    return _.get(this.getPool(), 'latestSeasonId');
  };

  this.autorun(() => {
    this.subscribe('pools.single', this.getPoolId(), () => {
      log.debug(`pools.single subscription ready: ${Pools.find(this.getPoolId()).count()}`);
      if (Pools.find(this.getPoolId()).count() === 0) {
        log.warn('poolsShow: Redirecting to / because Pools.count=0');
        FlowRouter.go('/');
      }

      // this is so we can suggest to users on the homepage where to find
      // the pool they were looking at
      Session.setPersistent('previousPoolId', this.getPoolId());
    });

    this.subscribe('seasons.single', this.getSeasonId());

    this.subscribe('seasons.latest.ofLeague', this.getLeagueId());
  });
});
