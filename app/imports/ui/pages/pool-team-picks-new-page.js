import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { AutoForm } from 'meteor/aldeed:autoform';
import log from '../../utils/log';

import './pool-team-picks-new-page.html';

import { PoolTeamPicks } from '../../api/pool_team_picks/pool_team_picks';
import { Seasons } from '../../api/seasons/seasons';
import { Pools } from '../../api/pools/pools';
import { PoolTeams } from '../../api/pool_teams/pool_teams';

Template.PoolTeamPicks_new_page.helpers({
  poolTeamPicks: () => PoolTeamPicks,

  poolId: () => Template.instance().getPoolId(),

  poolTeamId: () => Template.instance().getPoolTeamId(),

  seasonId: () => Template.instance().getSeasonId(),
});

Template.PoolTeamPicks_new_page.onCreated(function () {
  this.getPoolId = () => FlowRouter.getParam('poolId');
  this.getPool = () => Pools.findOne(this.getPoolId());

  this.getPoolTeamId = () => FlowRouter.getParam('poolTeamId');
  this.getPoolTeam = () => PoolTeams.findOne(this.getPoolTeamId());

  this.getLeagueId = () => _.get(this.getPoolTeam(), 'leagueId');

  this.getSeasonId = () => _.get(this.getPoolTeam(), 'seasonId');

  this.autorun(() => {
    this.subscribe('poolTeams.single', this.getPoolTeamId(), () => {
      log.debug('poolTeams.single subscription ready:', PoolTeams.find(this.getPoolTeamId()).count());
      this.subscribe('pools.single', this.getPoolId(), () => {
        this.subscribe('leagueTeams.ofLeague', this.getLeagueId());
      });

      this.subscribe('seasons.single', this.getSeasonId(), () => {
        log.debug(`seasons.single ready: ${this.getSeasonId()} ${Seasons.find(this.getSeasonId()).count()}`);
      });
    });

    this.subscribe('poolTeamPicks.ofPoolTeam', this.getPoolTeamId());
  });
});


AutoForm.hooks({
  insertPoolTeamPickForm: {
    onSuccess: (formType, poolTeamPickId) => {
      FlowRouter.go('PoolTeamPicks.show', {
        poolId: FlowRouter.getParam('poolId'),
        poolTeamId: FlowRouter.getParam('poolTeamId'),
        poolTeamPickId: FlowRouter.getParam('poolTeamPickId'),
      });
    },
  },
});
