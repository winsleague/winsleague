import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// useraccounts:core using the older export method so we can't resolve path
// eslint-disable-next-line import/no-unresolved
import { AccountsTemplates } from 'meteor/useraccounts:core';

import log from '../../../utils/log';

import '../../../ui/pages/pools-new-page';
import '../../../ui/pages/pools-show-page';
import '../../../ui/pages/pools-edit-page';
import '../../../ui/pages/pools-head-to-head-records-page';
import '../../../ui/pages/pools-records-page';

const group = FlowRouter.group({
  prefix: '/pools',
});

// http://app.com/pools
group.route('/', {
  action() {
    log.debug("We're viewing a list of pools.");
  },
});

// http://app.com/pools/new
group.route('/new', {
  name: 'Pools.new',
  triggersEnter: [AccountsTemplates.ensureSignedIn],
  action() {
    BlazeLayout.render('App_body', { content: 'Pools_new_page' });
  },
});

// http://app.com/pools/:poolId
group.route('/:poolId', {
  name: 'Pools.show',
  action(params) {
    log.debug(`We're viewing a single pool: ${params.poolId}`);
    BlazeLayout.render('App_body', { content: 'Pools_show_page' });
  },
});

// http://app.com/pools/:poolId/edit
group.route('/:poolId/edit', {
  name: 'Pools.edit',
  triggersEnter: [AccountsTemplates.ensureSignedIn],
  action(params) {
    log.debug(`We're editing a single pool: ${params.poolId}`);
    BlazeLayout.render('App_body', { content: 'Pools_edit_page' });
  },
});

// http://app.com/pools/:poolId/seasons/:seasonId
group.route('/:poolId/seasons/:seasonId', {
  name: 'Pools.show.season',
  action(params) {
    log.debug(`We're viewing a single pool: ${params.poolId} with season ${params.seasonId}`);
    BlazeLayout.render('App_body', { content: 'Pools_show_page' });
  },
});

// http://app.com/pools/:poolId/head-to-head-records
group.route('/:poolId/head-to-head-records', {
  name: 'Pools.head-to-head-records',
  action(params) {
    log.debug(`We're viewing head to head records for a single pool: ${params.poolId}`);
    BlazeLayout.render('App_body', { content: 'Pools_head_to_head_records_page' });
  },
});

// http://app.com/pools/:poolId/head-to-head-records
group.route('/:poolId/seasons/:seasonId/head-to-head-records', {
  name: 'Pools.head-to-head-records.season',
  action(params) {
    log.debug(`We're viewing head to head records for a single pool: ${params.poolId} with season ${params.seasonId}`);
    BlazeLayout.render('App_body', { content: 'Pools_head_to_head_records_page' });
  },
});

// http://app.com/pools/:poolId/records
group.route('/:poolId/records', {
  name: 'Pools.records',
  action(params) {
    log.debug(`We're viewing records for a single pool: ${params.poolId}`);
    BlazeLayout.render('App_body', { content: 'Pools_records_page' });
  },
});
