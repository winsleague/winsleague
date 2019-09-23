import { Template } from 'meteor/templating';
import SimpleSchema from 'simpl-schema';
import { _ } from 'lodash';

import { PoolTeamHeadToHeadRecords } from '../../api/pool_team_head_to_head_records/pool_team_head_to_head_records';

import './pools-records-pool-teams-head-to-head-records-best-season.html';

Template.Pools_records_pool_teams_head_to_head_records_best_season.helpers({
  poolTeamHeadToHeadRecords: () => PoolTeamHeadToHeadRecords.find(
    {
      poolId: Template.currentData().poolId,
      gameCount: { $gte: 8 },
    },
    {
      sort: { winPercentage: -1, wins: -1 },
      limit: 10,
    },
  ),
});

Template.Pools_records_pool_teams_head_to_head_records_best_season.onCreated(function () {
  new SimpleSchema({
    poolId: { type: String },
    recordTitle: { type: String },
    tableId: { type: String },
  }).validate(this.data);

  this.autorun(() => {
    this.subscribe('poolTeams.ofPool', this.data.poolId);

    this.subscribe('poolTeamHeadToHeadRecords.ofPool', this.data.poolId);
  });
});
