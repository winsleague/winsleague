import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import SimpleSchema from 'simpl-schema';

import { PoolTeams } from '../../api/pool_teams/pool_teams';
import { PoolTeamHeadToHeadRecords } from '../../api/pool_team_head_to_head_records/pool_team_head_to_head_records';

import './pools-head-to-head-records.html';

Template.Pools_head_to_head_records.helpers({
  poolTeamHeadToHeadRecords: () => {
    const { poolId, seasonId } = Template.currentData();
    return PoolTeamHeadToHeadRecords.find({ seasonId, poolId }, {
      sort: { wins: 1 },
      limit: 50,
    });
  },
});

Template.Pools_head_to_head_records.onCreated(function () {
  new SimpleSchema({
    leagueId: { type: String },
    seasonId: { type: String },
    poolId: { type: String },
    poolTeamId: { type: String, optional: true },
  }).validate(this.data);

  this.getPoolTeam = (poolTeamId) => PoolTeams.findOne(poolTeamId);

  this.autorun(() => {
    this.subscribe('poolTeamHeadToHeadRecords.ofPool', this.data.poolId, this.data.seasonId);
  });
});
