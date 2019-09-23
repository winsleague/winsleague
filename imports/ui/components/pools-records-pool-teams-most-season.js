import { Template } from 'meteor/templating';
import SimpleSchema from 'simpl-schema';
import { _ } from 'lodash';

import { PoolTeams } from '../../api/pool_teams/pool_teams';

import './pools-records-pool-teams-most-season.html';

Template.Pools_records_pool_teams_most_season.helpers({
  poolTeams: () => {
    const { metricField, sort } = Template.currentData();
    const filter = { sort: {}, limit: 10 };
    filter.sort[metricField] = sort;
    return PoolTeams.find(
      {
        poolId: Template.currentData().poolId,
      },
      filter,
    );
  },

  getMetric: (poolTeam) => _.get(poolTeam, Template.currentData().metricField),
});

Template.Pools_records_pool_teams_most_season.onCreated(function () {
  new SimpleSchema({
    poolId: { type: String },
    recordTitle: { type: String },
    metricTitle: { type: String },
    metricField: { type: String },
    sort: { type: SimpleSchema.Integer, allowedValues: [1, -1] },
    tableId: { type: String },
  }).validate(this.data);

  this.autorun(() => {
    this.subscribe('poolTeams.ofPool', this.data.poolId);
  });
});
