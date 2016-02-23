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

// http://app.com/pools/:_id
Routes.pools.route('/:_id', {
  name: 'poolsShow',
  action(params) {
    log.debug(`We're viewing a single document: ${params._id}`);
    BlazeLayout.render('masterLayout', { content: 'poolsShow' });
  },
});

// http://app.com/pools/:_id/edit
Routes.pools.route('/:_id/edit', {
  name: 'poolsEdit',
  action(params) {
    log.debug(`We're editing a single document: ${params._id}`);
    BlazeLayout.render('masterLayout', { content: 'poolsEdit' });
  },
});

// http://app.com/pools/:_id/seasons/:seasonId
Routes.pools.route('/:_id/seasons/:seasonId', {
  name: 'poolsShowSeason',
  action(params) {
    log.debug(`We're viewing a single document: ${params._id} with season ${params.seasonId}`);
    BlazeLayout.render('masterLayout', { content: 'poolsShow' });
  },
});

// http://app.com/pools/:_id/records
Routes.pools.route('/:_id/records', {
  name: 'poolsRecords',
  action(params) {
    log.debug(`We're viewing records for a single pool: ${params._id}`);
    BlazeLayout.render('masterLayout', { content: 'poolsRecords' });
  },
});

