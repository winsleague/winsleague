Meteor.startup(() => {
  if (process.env.NODE_ENV === 'production') Modules.server.loggly.init();

  // Note: this is not called when the test runner restarts due to a changed spec
  log.info(`Meteor.startup()`);

  if (Leagues.find().count() === 0) {
    Modules.server.seeds.createLeagues();
  }
});
