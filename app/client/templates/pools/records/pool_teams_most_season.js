Template.poolsRecordsPoolTeamsMostSeason.helpers({
  poolId: () => Template.instance().getPoolId(),

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

Template.poolsRecordsPoolTeamsMostSeason.onCreated(function() {
  new SimpleSchema({
    recordTitle: { type: String },
    metricTitle: { type: String },
    metricField: { type: String },
    sort: { type: Number, allowedValues: [1, -1] }
  }).validate(Template.currentData());

  this.getPoolId = () => FlowRouter.getParam('_id');

  this.autorun(() => {
    this.subscribe('poolTeams.ofPool', this.getPoolId());
  });
});
