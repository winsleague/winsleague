Template.poolsRecordsPoolTeamsMostSeason.helpers({
  poolTeams: () => {
    const metricField = Template.currentData().metricField;
    const sort = Template.currentData().sort;
    const filter = { sort: {}, limit: 3 };
    filter.sort[metricField] = sort;
    return PoolTeams.find({}, filter);
  },

  getMetric: (poolTeam) => {
    return _.get(poolTeam, Template.currentData().metricField);
  },
});

Template.poolsRecordsPoolTeamsMostSeason.onCreated(function () {
  new SimpleSchema({
    poolId: { type: String },
    recordTitle: { type: String },
    metricTitle: { type: String },
    metricField: { type: String },
    sort: { type: Number, allowedValues: [1, -1] },
    tableId: { type: String },
  }).validate(this.data);

  this.autorun(() => {
    this.subscribe('poolTeams.ofPool', this.data.poolId);
  });
});
