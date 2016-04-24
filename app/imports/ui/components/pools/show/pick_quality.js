Template.poolsShowPickQuality.helpers({
  playerName: (poolTeamPick) => {
    const poolTeam = Template.instance().getPoolTeam(poolTeamPick.poolTeamId);
    return _.get(poolTeam, 'userTeamName');
  },

  poolTeamPicks: () => {
    const poolId = Template.currentData().poolId;
    const seasonId = Template.currentData().seasonId;
    return PoolTeamPicks.find({ seasonId, poolId }, {
      sort: { pickQuality: Template.currentData().sort },
      limit: 5,
    });
  },

  leagueTeamName: (leagueTeamId) => {
    return LeagueTeams.findOne(leagueTeamId).abbreviation;
  },

  roundedPickQuality: (pickQuality) => pickQuality.toFixed(1),
});

Template.poolsShowPickQuality.onCreated(function () {
  new SimpleSchema({
    leagueId: { type: String },
    seasonId: { type: String },
    poolId: { type: String },
    tableTitle: { type: String },
    sort: { type: Number },
  }).validate(this.data);

  this.getPoolTeam = (poolTeamId) => PoolTeams.findOne(poolTeamId);

  this.autorun(() => {
    this.subscribe('poolTeamPicks.ofPool', this.data.poolId, this.data.seasonId);

    this.subscribe('poolTeams.ofPool', this.data.poolId, this.data.seasonId);

    this.subscribe('leagueTeams.ofLeague', this.data.leagueId);
  });
});
