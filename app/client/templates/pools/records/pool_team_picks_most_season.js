Template.poolsRecordsPoolTeamPicksMostSeason.helpers({
  poolId: () => Template.instance().getPoolId(),

  poolTeamPicks: () => {
    const metricField = Template.currentData().metricField;
    const sort = Template.currentData().sort;
    const filter = { sort: {}, limit: 3 };
    filter.sort[metricField] = sort;
    return PoolTeamPicks.find({}, filter);
  },

  getMetric: (poolTeamPick) => {
    return _.get(poolTeamPick, Template.currentData().metricField);
  },

  playerName: (poolTeamPick) => {
    return _.get(Template.instance().getPoolTeam(poolTeamPick.poolTeamId), 'userTeamName');
  },

  leagueTeamName: (leagueTeamId) => {
    return LeagueTeams.findOne(leagueTeamId).abbreviation;
  },

  roundedPickQuality: (pickQuality) => pickQuality.toFixed(2),
});

Template.poolsRecordsPoolTeamPicksMostSeason.onCreated(function() {
  new SimpleSchema({
    poolId: { type: String },
    recordTitle: { type: String },
    metricTitle: { type: String },
    metricField: { type: String },
    sort: { type: Number, allowedValues: [1, -1] },
    tableId: { type: String },
  }).validate(this.data);

  this.getPoolId = () => this.data.poolId;

  this.getPool = () => Pools.findOne(this.getPoolId());

  this.getLeagueId = () => _.get(this.getPool(), 'leagueId');

  this.getPoolTeam = (poolTeamId) => PoolTeams.findOne(poolTeamId);

  this.autorun(() => {
    this.subscribe('poolTeamPicks.ofPool', this.getPoolId());

    this.subscribe('poolTeams.ofPool', this.getPoolId());

    this.subscribe('pools.single', this.getPoolId(), () => {
      this.subscribe('leagueTeams.ofLeague', this.getLeagueId());
    });
  });
});
