FlowRouter.route('/', {
  action: function() {
    BlazeLayout.render("MasterLayout", { content: "Home" });
  }
});

FlowRouter.notFound = {
  action: function() {
    BlazeLayout.render("MasterLayout", { content: "NotFound" });
  }
};
