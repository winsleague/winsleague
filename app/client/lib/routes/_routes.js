Routes = {};

Routes.pools = FlowRouter.group({
  prefix: '/pools',
});

Routes.poolTeams = Routes.pools.group({
  prefix: '/teams',
});

Routes.poolTeamPicks = Routes.poolTeams.group({
  prefix: '/picks',
});

FlowRouter.route('/', {
  action() {
    BlazeLayout.render('masterLayout', { content: 'home' });
  },
});

FlowRouter.notFound = {
  action() {
    BlazeLayout.render('masterLayout', { content: 'notFound' });
  },
};
