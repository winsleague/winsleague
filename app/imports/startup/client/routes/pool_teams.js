import { log } from '../../log';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { AccountsTemplates } from 'meteor/useraccounts:core';

const group = FlowRouter.group({
  prefix: '/pools/:poolId/teams',
});

// http://app.com/pools/:poolId/teams/new
group.route('/new', {
  name: 'poolTeamsNew',
  triggersEnter: [AccountsTemplates.ensureSignedIn],
  action(params) {
    log.debug(`We're creating teams for a pool: ${params.poolId}`);
    BlazeLayout.render('masterLayout', { content: 'poolTeamsNew' });
  },
});

// http://app.com/pools/:poolId/teams/:poolTeamId
group.route('/:poolTeamId', {
  name: 'poolTeamsShow',
  action(params) {
    log.debug(`We're showing a pool team: ${params.poolId} and ${params.poolTeamId}`);
    BlazeLayout.render('masterLayout', { content: 'poolTeamsShow' });
  },
});

// http://app.com/pools/:poolId/teams/:poolTeamId/edit
group.route('/:poolTeamId/edit', {
  name: 'poolTeamsEdit',
  triggersEnter: [AccountsTemplates.ensureSignedIn],
  action(params) {
    log.debug(`We're editing a pool team: ${params.poolId} and ${params.poolTeamId}`, params);
    BlazeLayout.render('masterLayout', { content: 'poolTeamsEdit' });
  },
});
