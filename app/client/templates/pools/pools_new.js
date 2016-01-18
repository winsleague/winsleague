Template.poolsNew.events({
});

Template.poolsNew.helpers({
  leagueOptions() {
    return Leagues.find({}).map(league => { return { label: league.name, value: league._id }; });
  },
  nflLeagueId() { return Template.instance().getNflLeagueId(); },
});

Template.poolsNew.onCreated(function() {
  this.getNflLeagueId = () => {
    const league = Leagues.findOne({ name: 'NFL' }, { fields: { _id: 1 } });
    if (league) return league._id;
  };

  this.autorun(() => {
    this.subscribe('leagues', () => {
      log.info(`League data ready: ${Leagues.find().count()} leagues`);
    });
    this.subscribe('seasons', () => {
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
      FlowRouter.go('poolsShow', { _id: poolId });
    },
  },
});
