import { log } from '../../log';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { AccountsTemplates } from 'meteor/useraccounts:core';

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
  name: 'poolsNew',
  triggersEnter: [AccountsTemplates.ensureSignedIn],
  action() {
    BlazeLayout.render('masterLayout', { content: 'poolsNew' });
  },
});

// http://app.com/pools/:poolId
group.route('/:poolId', {
  name: 'poolsShow',
  action(params) {
    log.debug(`We're viewing a single pool: ${params.poolId}`);
    BlazeLayout.render('masterLayout', { content: 'poolsShow' });
  },
});

// http://app.com/pools/:poolId/edit
group.route('/:poolId/edit', {
  name: 'poolsEdit',
  triggersEnter: [AccountsTemplates.ensureSignedIn],
  action(params) {
    log.debug(`We're editing a single pool: ${params.poolId}`);
    BlazeLayout.render('masterLayout', { content: 'poolsEdit' });
  },
});

// http://app.com/pools/:poolId/seasons/:seasonId
group.route('/:poolId/seasons/:seasonId', {
  name: 'poolsShowSeason',
  action(params) {
    log.debug(`We're viewing a single pool: ${params.poolId} with season ${params.seasonId}`);
    BlazeLayout.render('masterLayout', { content: 'poolsShow' });
  },
});

// http://app.com/pools/:poolId/records
group.route('/:poolId/records', {
  name: 'poolsRecords',
  action(params) {
    log.debug(`We're viewing records for a single pool: ${params.poolId}`);
    BlazeLayout.render('masterLayout', { content: 'poolsRecords' });
  },
});
