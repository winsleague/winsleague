Template.poolsShowPickQuality.helpers({
  playerName: (poolTeamPick) => {
    return _.get(Template.instance().getPoolTeam(poolTeamPick.poolTeamId), 'userTeamName');
  },

  poolTeamPicks: () => {
    const poolId = Template.instance().getPoolId();
    const seasonId = Template.instance().getSeasonId();
    return PoolTeamPicks.find({ seasonId, poolId }, {
      sort: { pickQuality: Template.currentData().sort },
      limit: 5,
    });
  },

  leagueTeamName: (leagueTeamId) => {
    return LeagueTeams.findOne(leagueTeamId).abbreviation;
  },

  roundedPickQuality: (pickQuality) => pickQuality.toFixed(2),
});

Template.poolsShowPickQuality.onCreated(function() {
  this.getPoolId = () => FlowRouter.getParam('poolId');

  this.getPool = () => Pools.findOne(this.getPoolId());

  this.getLeagueId = () => _.get(this.getPool(), 'leagueId');

  this.getSeasonId = () => {
    const seasonId = FlowRouter.getParam('seasonId');
    if (seasonId) return seasonId;
    const season = Modules.seasons.getLatestByLeagueId(this.getLeagueId());
    return _.get(season, '_id');
  };

  this.getPoolTeam = (poolTeamId) => PoolTeams.findOne(poolTeamId);

  this.autorun(() => {
    this.subscribe('poolTeamPicks.ofPool', this.getPoolId(), this.getSeasonId());

    this.subscribe('poolTeams.ofPool', this.getPoolId(), this.getSeasonId());

    this.subscribe('pools.single', this.getPoolId(), () => {
      this.subscribe('seasons.single', this.getSeasonId());

      this.subscribe('seasons.latest.ofLeague', this.getLeagueId());

      this.subscribe('leagueTeams.ofLeague', this.getLeagueId());
    });
  });
});
