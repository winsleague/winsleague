Template.poolsRecordsPoolTeamsMostSeason.helpers({
  poolId: () => Template.instance().getPoolId(),

  poolTeams: () => {
    const metricField = Template.currentData().metricField;
    const sort = Template.currentData().sort;
    return PoolTeams.find({}, { sort: { metricField: sort }, limit: 3 });
  },

  getMetric: (poolTeam) => {
    log.info('poolTeam ', poolTeam);
    log.info('metric ', Template.currentData().metricField);
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
