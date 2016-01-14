FlowRouter.route('/', {
  action: function() {
    BlazeLayout.render("masterLayout", { content: "home" });
  }
});

FlowRouter.notFound = {
  action: function() {
    BlazeLayout.render("masterLayout", { content: "notFound" });
  }
};
