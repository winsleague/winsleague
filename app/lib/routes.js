/*
Router.configure({
  layoutTemplate: 'MasterLayout',
  loadingTemplate: 'Loading',
  notFoundTemplate: 'NotFound'
});
*/


FlowRouter.route('/', {
  name: 'home',
  action: function() {
    log.info(`home page`);
    BlazeLayout.render("MasterLayout", { content: "Home" });
  }
});

FlowRouter.notFound = {
  action: function() {
    log.error(`not found!`);
    BlazeLayout.render("MasterLayout", { content: "NotFound" });
  }
};

var pools = FlowRouter.group({
  prefix: '/pools'
});

// http://app.com/pools
pools.route( '/', {
  action: function() {
    console.log( "We're viewing a list of pools." );
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