import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { AccountsTemplates } from 'meteor/useraccounts:core';

import log from '../../../utils/log';

import '../../../ui/pages/pool-teams-new-page';
import '../../../ui/pages/pool-teams-show-page';
import '../../../ui/pages/pool-teams-edit-page';

const group = FlowRouter.group({
  prefix: '/pools/:poolId/teams',
});

// http://app.com/pools/:poolId/teams/new
group.route('/new', {
  name: 'PoolTeams.new',
  triggersEnter: [AccountsTemplates.ensureSignedIn],
  action(params) {
    log.debug(`We're creating teams for a pool: ${params.poolId}`);
    BlazeLayout.render('App_body', { content: 'PoolTeams_new_page' });
  },
});

// http://app.com/pools/:poolId/teams/:poolTeamId
group.route('/:poolTeamId', {
  name: 'PoolTeams.show',
  action(params) {
    log.debug(`We're showing a pool team: ${params.poolId} and ${params.poolTeamId}`);
    BlazeLayout.render('App_body', { content: 'PoolTeams_show_page' });
  },
});

// http://app.com/pools/:poolId/teams/:poolTeamId/edit
group.route('/:poolTeamId/edit', {
  name: 'PoolTeams.edit',
  triggersEnter: [AccountsTemplates.ensureSignedIn],
  action(params) {
    log.debug(`We're editing a pool team: ${params.poolId} and ${params.poolTeamId}`, params);
    BlazeLayout.render('App_body', { content: 'PoolTeams_edit_page' });
  },
});
