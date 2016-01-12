const pools = FlowRouter.group({
  prefix: '/pools'
});

// http://app.com/pools
pools.route( '/', {
  action: function() {
    console.log( "We're viewing a list of pools." );
  }
});

// http://app.com/pools/new
pools.route( '/new', {
  action: function() {
    BlazeLayout.render("MasterLayout", { content: "poolNew" });
  }
});

// http://app.com/pools/:_id
pools.route( '/:_id', {
  action: function() {
    console.log( "We're viewing a single document." );
  }
});

// http://app.com/pools/:_id/edit
pools.route( '/:_id/edit', {
  action: function() {
    console.log( "We're editing a single document." );
  }
});
