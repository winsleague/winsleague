Routes.poolTeamPicks = FlowRouter.group({
  prefix: '/pools/:poolId/teams/:poolTeamId/picks',
});

// http://app.com/pools/:poolId/teams/:poolTeamId/new
Routes.poolTeamPicks.route('/new', {
  name: 'poolTeamPicksNew',
  action(params) {
    log.debug(`We're creating picks for a pool team: ${params.poolTeamId}`);
    BlazeLayout.render('masterLayout', { content: 'poolTeamPicksNew' });
  },
});

// http://app.com/pools/:poolId/teams/:poolTeamId/picks/:poolTeamPickId/edit
Routes.poolTeamPicks.route('/:poolTeamPickId/edit', {
  name: 'poolTeamPicksEdit',
  action(params) {
    log.debug(`We're editing a pool team pick: ${params.poolTeamId} and ${params.poolTeamPickId}`);
    BlazeLayout.render('masterLayout', { content: 'poolTeamPicksEdit' });
  },
});

