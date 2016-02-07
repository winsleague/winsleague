Template.poolsNew.events({
});

Template.poolsNew.helpers({
  leagueOptions() {
    return Leagues.find().map(league => { return { label: league.name, value: league._id }; });
  },
  nflLeagueId() { return Template.instance().getNflLeagueId(); },
});

Template.poolsNew.onCreated(function() {
  this.getNflLeagueId = () => {
    const league = Leagues.findOne({ name: 'NFL' }, { fields: { _id: 1 } });
    if (league) return league._id;
  };

  this.autorun(() => {
    this.subscribe('leagues.list', () => {
      const leagues = Leagues.find().map(league => { return league._id; });
      log.info(`leagues.list subscription ready: ${Leagues.find().count()} leagues, %j`, leagues);
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

