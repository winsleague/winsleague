import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { _ } from 'lodash';

import { PoolTeamPicks } from '../../api/pool_team_picks/pool_team_picks';
import { LeagueTeams } from '../../api/league_teams/league_teams';
import { Pools } from '../../api/pools/pools';
import { PoolTeams } from '../../api/pool_teams/pool_teams';

import './pools-records-pool-team-picks-most-season.html';

Template.Pools_records_pool_team_picks_most_season.helpers({
  poolTeamPicks: () => {
    const metricField = Template.currentData().metricField;
    const sort = Template.currentData().sort;
    const filter = { sort: {}, limit: 3 };
    filter.sort[metricField] = sort;
    return PoolTeamPicks.find(
      {
        poolId: Template.currentData().poolId,
      },
      filter
    );
  },

  getMetric: (poolTeamPick) => _.get(poolTeamPick, Template.currentData().metricField),

  playerName: (poolTeamPick) => _.get(Template.instance().getPoolTeam(poolTeamPick.poolTeamId), 'userTeamName'),

  leagueTeamName: (leagueTeamId) => _.get(LeagueTeams.findOne(leagueTeamId), 'abbreviation'),

  roundedPickQuality: (pickQuality) => pickQuality.toFixed(1),
});

Template.Pools_records_pool_team_picks_most_season.onCreated(function () {
  new SimpleSchema({
    poolId: { type: String },
    recordTitle: { type: String },
    metricTitle: { type: String },
    metricField: { type: String },
    sort: { type: Number, allowedValues: [1, -1] },
    tableId: { type: String },
  }).validate(this.data);

  this.getPool = () => Pools.findOne(this.data.poolId);

  this.getLeagueId = () => _.get(this.getPool(), 'leagueId');

  this.getPoolTeam = (poolTeamId) => PoolTeams.findOne(poolTeamId);

  this.autorun(() => {
    this.subscribe('poolTeamPicks.ofPool', this.data.poolId);

    this.subscribe('poolTeams.ofPool', this.data.poolId);

    this.subscribe('pools.single', this.data.poolId, () => {
      this.subscribe('leagueTeams.ofLeague', this.getLeagueId());
    });
  });
});
