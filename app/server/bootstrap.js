Meteor.startup(() => {
  if (Modules.environment.isProduction()) Modules.server.loggly.init();

  // Note: this is not called when the test runner restarts due to a changed spec
  log.info(`Meteor.startup()`);


  Migrations.config({ logger: log });
  Migrations.migrateTo('latest');

  if (Leagues.find().count() === 0) {
    Modules.server.seeds.createLeagues();
  }
});
