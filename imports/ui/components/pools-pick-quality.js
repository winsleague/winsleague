import { Template } from 'meteor/templating';
import SimpleSchema from 'simpl-schema';

import { LeagueTeams } from '../../api/league_teams/league_teams';
import { PoolTeams } from '../../api/pool_teams/pool_teams';
import { PoolTeamPicks } from '../../api/pool_team_picks/pool_team_picks';

import './pools-pick-quality.html';

Template.Pools_pick_quality.helpers({
  poolId: () => Template.currentData().poolId,

  seasonId: () => Template.currentData().seasonId,

  playerName: (poolTeamPick) => {
    const poolTeam = Template.instance().getPoolTeam(poolTeamPick.poolTeamId);
    return poolTeam.friendlyTeamName();
  },

  poolTeamPicks: () => {
    const { poolId, seasonId } = Template.currentData();
    return PoolTeamPicks.find({ seasonId, poolId, pointsMetric: 'wins' }, {
      sort: { pickQuality: Template.currentData().sort },
      limit: Template.currentData().limit,
    });
  },

  leagueTeamName: (leagueTeamId) => LeagueTeams.findOne(leagueTeamId).abbreviation,

  myTeamClass: (poolTeamId) => {
    if (poolTeamId === Template.currentData().poolTeamId) {
      if (Template.currentData().sort === -1) {
        return 'success';
      }
      return 'danger';
    }
    return '';
  },
});

Template.Pools_pick_quality.onCreated(function () {
  new SimpleSchema({
    leagueId: { type: String },
    seasonId: { type: String },
    poolId: { type: String },
    tableTitle: { type: String },
    sort: { type: SimpleSchema.Integer, allowedValues: [1, -1] },
    limit: { type: SimpleSchema.Integer, optional: true, defaultValue: 32 },
    poolTeamId: { type: String, optional: true },
  }).validate(this.data);

  this.getPoolTeam = (poolTeamId) => PoolTeams.findOne(poolTeamId);

  this.autorun(() => {
    this.subscribe('poolTeamPicks.ofPool', this.data.poolId, this.data.seasonId);

    this.subscribe('poolTeams.ofPool', this.data.poolId, this.data.seasonId);

    this.subscribe('leagueTeams.ofLeague', this.data.leagueId);
  });
});
