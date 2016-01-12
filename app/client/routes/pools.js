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
    BlazeLayout.render("masterLayout", { content: "poolNew" });
  }
});

// http://app.com/pools/:_id
pools.route( '/:_id', {
  action: function(params) {
    console.log(`We're viewing a single document: ${FlowRouter.getParam('_id')}`);
    BlazeLayout.render("masterLayout", { content: "poolShow" });
  }
});

// http://app.com/pools/:_id/edit
pools.route( '/:_id/edit', {
  action: function() {
    console.log( "We're editing a single document." );
  }
});
