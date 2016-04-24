import '../imports/startup/server';

Meteor.startup(() => {
  Modules.server.seeds.utils.initializeLeagues();
});
