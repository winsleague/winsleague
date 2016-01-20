const poolsRoutes = FlowRouter.group({
  prefix: '/pools'
});

// http://app.com/pools
poolsRoutes.route( '/', {
  action: function() {
    console.log( "We're viewing a list of pools." );
  }
});

// http://app.com/pools/new
poolsRoutes.route( '/new', {
  name: "poolsNew",
  action: function() {
    BlazeLayout.render("masterLayout", { content: "poolsNew" });
  }
});

// http://app.com/pools/:_id
poolsRoutes.route( '/:_id', {
  name: "poolsShow",
  action: function(params) {
    console.log(`We're viewing a single document: ${params._id}`);
    BlazeLayout.render("masterLayout", { content: "poolsShow" });
  }
});

// http://app.com/pools/:_id/edit
poolsRoutes.route( '/:_id/edit', {
  action: function(params) {
    console.log(`We're editing a single document: ${params._id}`);
  }
});

// http://app.com/pools/:_poolId/teams/new
poolsRoutes.route( '/:poolId/teams/new', {
  name: "poolTeamsNew",
  action: function(params) {
    console.log(`We're creating teams for a pool: ${params.poolId}`);
    BlazeLayout.render("masterLayout", { content: "poolTeamsNew" });
  }
});
