Template.poolTeamsNew.helpers({
  schema: PoolTeams.formSchema,

  poolId: () => Template.instance().getPoolId(),
});

Template.poolTeamsNew.onCreated(function() {
  this.getPoolId = () => FlowRouter.getParam('poolId');

  this.getLeagueId = () => Pools.findOne(this.getPoolId(), { fields: { leagueId: 1 } }).leagueId;

  this.autorun(() => {
    this.subscribe('pools.single', this.getPoolId(), () => {
      log.debug(`pools.single subscription ready: ${Pools.find().count()} pools`);
      this.subscribe('leagueTeams.ofLeague', this.getLeagueId(), () => {
        log.debug(`leagueTeams.of_league subscription ready: ${LeagueTeams.find().count()} teams`);
      });
    });
  });
});


AutoForm.hooks({
  insertPoolTeamForm: {
    onSuccess: (formType, poolTeamId) => {
      FlowRouter.go('poolsShow', { poolId: FlowRouter.getParam('poolId') });
    },
  },
});
