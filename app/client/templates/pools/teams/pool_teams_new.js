Template.poolTeamsNew.events({
});

Template.poolTeamsNew.helpers({
  schema: PoolTeams.formSchema,
  poolId: () => {
    const instance = Template.instance();
    return instance.getPoolId();
  },
});

Template.poolTeamsNew.onCreated(function() {
  this.getPoolId = () => FlowRouter.getParam('poolId');
  this.getLeagueId = () => Pools.findOne(this.getPoolId(), { fields: { leagueId: 1 } }).leagueId;

  this.autorun(() => {
    this.subscribe('pools.single', this.getPoolId(), () => {
      log.info(`pool subscription ready: ${Pools.find().count()} pools`);
      this.subscribe('leagueTeams.of_league', this.getLeagueId(), () => {
        log.info(`leagueTeams subscription ready: ${LeagueTeams.find().count()} teams`);
      });
    });
  });
});

Template.poolTeamsNew.onRendered(function() {
});

Template.poolTeamsNew.onDestroyed(function() {
});


AutoForm.hooks({
  insertPoolTeamForm: {
    onSuccess: (operation, doc) => {
      FlowRouter.go('poolsShow', { _id: FlowRouter.getParam('poolId') });
    },
  },
});
