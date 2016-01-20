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
      const leagues = Leagues.find({}).map(league => { return league._id; });
      log.info(`League data ready: ${Leagues.find().count()} leagues, %j`, leagues);
    });
    this.subscribe('seasons', () => {
      const seasons = Seasons.find({}).map(season => { return season._id; });
      log.info(`Season data ready: ${Seasons.find().count()} seasons, %j`, seasons);
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

