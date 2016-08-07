import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { _ } from 'lodash';

import { PoolTeams } from '../../api/pool_teams/pool_teams';

import './pools-records-pool-teams-most-season.html';

Template.Pools_records_pool_teams_most_season.helpers({
  poolTeams: () => {
    const metricField = Template.currentData().metricField;
    const sort = Template.currentData().sort;
    const filter = { sort: {}, limit: 3 };
    filter.sort[metricField] = sort;
    return PoolTeams.find({}, filter);
  },

  getMetric: (poolTeam) => _.get(poolTeam, Template.currentData().metricField),
});

Template.Pools_records_pool_teams_most_season.onCreated(function () {
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
