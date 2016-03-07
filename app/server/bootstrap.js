Meteor.startup(() => {
  if (Modules.environment.isProduction()) Modules.server.loggly.init();

  // Note: this is not called when the test runner restarts due to a changed spec
  log.info(`Meteor.startup()`);

  Modules.server.seeds.utils.initializeLeagues();

  Migrations.config({ logger: log });
  Migrations.migrateTo('latest');
});
