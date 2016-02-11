Template.poolsHeader.helpers({
  title: () => {
    const name = _.get(Template.instance().getPool(), 'name');
    const year = Template.instance().seasonYear();
    if (year) return `${year} ${name}`;
    return name;
  },
});

Template.poolsHeader.onCreated(function() {
  this.getPoolId = () => FlowRouter.getParam('_id');

  this.getPool = () => Pools.findOne(this.getPoolId());

  this.getLeagueId = () => _.get(this.getPool(), 'leagueId');

  this.getSeasonId = () => FlowRouter.getParam('seasonId');

  this.seasonYear = () => {
    const poolTeam = PoolTeams.findOne();
    if (poolTeam) {
      // just pick seasonYear from one of the PoolTeams
      return poolTeam.seasonYear;
    } else {
      // no pool teams exist, so pick latest year
      return _.get(Seasons.findOne(), 'year');
    }
  };

  this.autorun(() => {
    this.subscribe('pools.single', this.getPoolId(), () => {
      log.debug(`pools.single subscription ready: ${Pools.find(this.getPoolId()).count()}`);
      if (Pools.find(this.getPoolId()).count() === 0) FlowRouter.go('/');
    });

    this.subscribe('poolTeams.ofPool', this.getPoolId(), this.getSeasonId());

    this.subscribe('seasons.single', this.getSeasonId());

    this.subscribe('seasons.latest.ofLeague', this.getLeagueId());
  });
});
