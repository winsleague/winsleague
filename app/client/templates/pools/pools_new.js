Template.poolsNew.events({
});

Template.poolsNew.helpers({
  leagueOptions: function() {
    return Leagues.find({}).map( function(league) { return { label: league.name, value: league._id } } );
  },
  nflLeagueId: function() {
    return Leagues.findOne({ name: "NFL" })._id;
  }
});

Template.poolsNew.onCreated(function() {
  this.autorun(function() {
    this.subscribe('leagues', function() {
      log.info(`League data ready: ${Leagues.find().count()} leagues`);
    });
    this.subscribe('seasons', function() {
      log.info(`Season data ready: ${Seasons.find().count()} seasons`);
    });
  });
});

Template.poolsNew.onRendered(function() {
});

Template.poolsNew.onDestroyed(function() {
});


AutoForm.hooks({
  insertPoolForm: {
    onSuccess: function(operation, poolId) {
      FlowRouter.go("poolsShow", { _id: poolId });
    }
  }
});
