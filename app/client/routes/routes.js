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
