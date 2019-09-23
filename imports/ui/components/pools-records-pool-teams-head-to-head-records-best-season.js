import { Template } from 'meteor/templating';
import SimpleSchema from 'simpl-schema';
import { _ } from 'lodash';

import { PoolTeamHeadToHeadRecords } from '../../api/pool_team_head_to_head_records/pool_team_head_to_head_records';

import './pools-records-pool-teams-head-to-head-records-best-season.html';

Template.Pools_records_pool_teams_head_to_head_records_best_season.helpers({
  poolTeamHeadToHeadRecords: () => {
    const { metricField, sort } = Template.currentData();
    const filter = { sort: {}, limit: 10 };
    filter.sort[metricField] = sort;
    return PoolTeamHeadToHeadRecords.find(
      {
        poolId: Template.currentData().poolId,
      },
      filter,
    );
  },
});

Template.Pools_records_pool_teams_head_to_head_records_best_season.onCreated(function () {
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

    this.subscribe('poolTeamHeadToHeadRecords.ofPool', this.data.poolId);
  });
});
