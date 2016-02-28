Routes.pools = FlowRouter.group({
  prefix: '/pools',
});

// http://app.com/pools
Routes.pools.route('/', {
  action() {
    log.debug("We're viewing a list of pools.");
  },
});

// http://app.com/pools/new
Routes.pools.route('/new', {
  name: 'poolsNew',
  action() {
    BlazeLayout.render('masterLayout', { content: 'poolsNew' });
  },
});

// http://app.com/pools/:poolId
Routes.pools.route('/:poolId', {
  name: 'poolsShow',
  action(params) {
    log.debug(`We're viewing a single pool: ${params.poolId}`);
    BlazeLayout.render('masterLayout', { content: 'poolsShow' });
  },
});

// http://app.com/pools/:poolId/edit
Routes.pools.route('/:poolId/edit', {
  name: 'poolsEdit',
  action(params) {
    log.debug(`We're editing a single pool: ${params.poolId}`);
    BlazeLayout.render('masterLayout', { content: 'poolsEdit' });
  },
});

// http://app.com/pools/:poolId/seasons/:seasonId
Routes.pools.route('/:poolId/seasons/:seasonId', {
  name: 'poolsShowSeason',
  action(params) {
    log.debug(`We're viewing a single pool: ${params.poolId} with season ${params.seasonId}`);
    BlazeLayout.render('masterLayout', { content: 'poolsShow' });
  },
});

// http://app.com/pools/:poolId/records
Routes.pools.route('/:poolId/records', {
  name: 'poolsRecords',
  action(params) {
    log.debug(`We're viewing records for a single pool: ${params.poolId}`);
    BlazeLayout.render('masterLayout', { content: 'poolsRecords' });
  },
});

