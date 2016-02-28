// http://app.com/pools/:poolId/teams/new
Routes.poolTeams.route('/new', {
  name: 'poolTeamsNew',
  action(params) {
    log.debug(`We're creating teams for a pool: ${params.poolId}`);
    BlazeLayout.render('masterLayout', { content: 'poolTeamsNew' });
  },
});

// http://app.com/pools/:poolId/teams/:poolTeamId
Routes.poolTeams.route('/:poolTeamId', {
  name: 'poolTeamsShow',
  action(params) {
    log.debug(`We're showing a pool team: ${params.poolId} and ${params.poolTeamId}`);
    BlazeLayout.render('masterLayout', { content: 'poolTeamsShow' });
  },
});

// http://app.com/pools/:poolId/teams/:poolTeamId/edit
Routes.poolTeams.route('/:poolTeamId/edit', {
  name: 'poolTeamsEdit',
  action(params) {
    log.debug(`We're editing a pool team: ${params.poolId} and ${params.poolTeamId}`, params);
    BlazeLayout.render('masterLayout', { content: 'poolTeamsEdit' });
  },
});
