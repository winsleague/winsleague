Template.poolsNew.helpers({
  leagueOptions: () => Leagues.find().map(league => { return { label: league.name, value: league._id }; }),

  nflLeagueId: () => Template.instance().getNflLeagueId(),
});

Template.poolsNew.onCreated(function () {
  this.getNflLeagueId = () => {
    const league = Leagues.findOne({ name: 'NFL' }, { fields: { _id: 1 } });
    if (league) return league._id;
  };

  this.autorun(() => {
    this.subscribe('leagues.list', () => {
      const leagues = Leagues.find().map(league => { return league._id; });
      log.debug(`leagues.list subscription ready: ${Leagues.find().count()} leagues, %j`, leagues);

      this.subscribe('seasons.latest');
    });
  });
});


AutoForm.hooks({
  insertPoolForm: {
    onSuccess: (formType, poolId) => {
      FlowRouter.go('Pools.show', { poolId });
    },
  },
});

