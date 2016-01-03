Meteor.startup(() => {
  if (Leagues.find().count() === 0) {
    Modules.server.seeds.createLeagues();
  }
});
