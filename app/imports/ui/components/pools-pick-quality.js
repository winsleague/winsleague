import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { _ } from 'lodash';

import { LeagueTeams } from '../../api/league_teams/league_teams';
import { PoolTeams } from '../../api/pool_teams/pool_teams';
import { PoolTeamPicks } from '../../api/pool_team_picks/pool_team_picks';

import './pools-pick-quality.html';

Template.Pools_pick_quality.helpers({
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

  leagueTeamName: (leagueTeamId) => LeagueTeams.findOne(leagueTeamId).abbreviation,

  roundedPickQuality: (pickQuality) => pickQuality.toFixed(1),
});

Template.Pools_pick_quality.onCreated(function () {
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
