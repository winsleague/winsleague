Template.poolNew.events({
});

Template.poolNew.helpers({
  leagueOptions: function () {
    return Leagues.find({}).map( function(league) { return { label: league.name, value: league._id } } );
  }
});

Template.poolNew.onCreated(function () {
  var self = this;
  self.autorun(function() {
    self.subscribe('leagues', function () {
      log.info(`League data ready: ${Leagues.find().count()} leagues`);
    });
  });
});

Template.poolNew.onRendered(function () {
});

Template.poolNew.onDestroyed(function () {
});
