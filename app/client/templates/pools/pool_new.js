Template.poolNew.events({
});

Template.poolNew.helpers({
  leagueOptions: function() {
    return Leagues.find({}).map( function(league) { return { label: league.name, value: league._id } } );
  },
  nflLeagueId: function() {
    return Leagues.findOne({ name: "NFL" })._id;
  }
});

Template.poolNew.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('leagues', function() {
      log.info(`League data ready: ${Leagues.find().count()} leagues`);
    });
    self.subscribe('seasons', function() {
      log.info(`Season data ready: ${Seasons.find().count()} seasons`);
    });
  });
});

Template.poolNew.onRendered(function() {
});

Template.poolNew.onDestroyed(function() {
});
