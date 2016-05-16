import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { AutoForm } from 'meteor/aldeed:autoform';
import log from '../../startup/log';

import './pool-teams-new-page.html';

import { LeagueTeams } from '../../api/league_teams/league_teams';
import { Pools } from '../../api/pools/pools';
import { PoolTeams } from '../../api/pool_teams/pool_teams';

Template.PoolTeams_new_page.helpers({
  schema: PoolTeams.formSchema,

  poolId: () => Template.instance().getPoolId(),
});

Template.PoolTeams_new_page.onCreated(function () {
  this.getPoolId = () => FlowRouter.getParam('poolId');

  this.getLeagueId = () => Pools.findOne(this.getPoolId(), { fields: { leagueId: 1 } }).leagueId;

  this.autorun(() => {
    this.subscribe('pools.single', this.getPoolId(), () => {
      log.debug(`pools.single subscription ready: ${Pools.find().count()} pools`);
      this.subscribe('leagueTeams.ofLeague', this.getLeagueId(), () => {
        log.debug(`leagueTeams.of_league subscription ready: ${LeagueTeams.find().count()} teams`);
      });
    });
  });
});


AutoForm.hooks({
  insertPoolTeamForm: {
    onSuccess: (formType, poolTeamId) => {
      FlowRouter.go('PoolTeams.show', {
        poolId: FlowRouter.getParam('poolId'),
        poolTeamId,
      });
    },
  },
});
