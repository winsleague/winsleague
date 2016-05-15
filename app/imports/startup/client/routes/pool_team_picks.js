import log from '../../log';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { AccountsTemplates } from 'meteor/useraccounts:core';

const group = FlowRouter.group({
  prefix: '/pools/:poolId/teams/:poolTeamId/picks',
});

// http://app.com/pools/:poolId/teams/:poolTeamId/picks/new
group.route('/new', {
  name: 'poolTeamPicksNew',
  triggersEnter: [AccountsTemplates.ensureSignedIn],
  action(params) {
    log.debug(`We're creating picks for a pool team: ${params.poolTeamId}`);
    BlazeLayout.render('App_body', { content: 'poolTeamPicksNew' });
  },
});

// http://app.com/pools/:poolId/teams/:poolTeamId/picks/:poolTeamPickId/edit
group.route('/:poolTeamPickId/edit', {
  name: 'poolTeamPicksEdit',
  triggersEnter: [AccountsTemplates.ensureSignedIn],
  action(params) {
    log.debug(`We're editing a pool team pick: ${params.poolTeamId} and ${params.poolTeamPickId}`);
    BlazeLayout.render('App_body', { content: 'poolTeamPicksEdit' });
  },
});
