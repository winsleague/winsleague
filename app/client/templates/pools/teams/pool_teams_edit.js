Template.poolTeamsEdit.events({
});

Template.poolTeamsEdit.helpers({
  poolId: () => Template.instance().getPoolId(),
  poolTeamDoc: () => Template.instance().getPoolTeamDoc(),
});

Template.poolTeamsEdit.onCreated(function() {
  this.getPoolId = () => FlowRouter.getParam('poolId');
  this.getPoolTeamId = () => FlowRouter.getParam('poolTeamId');
  this.getLeagueId = () => Pools.findOne(this.getPoolId(), { fields: { leagueId: 1 } }).leagueId;
  this.getPoolTeamDoc = () => PoolTeams.findOne(this.getPoolTeamId());

  this.autorun(() => {
    this.subscribe('pools.single', this.getPoolId(), () => {
      log.info(`pools.single subscription ready: ${Pools.find().count()} pools`);
      this.subscribe('leagueTeams.of_league', this.getLeagueId(), () => {
        log.info(`leagueTeams subscription ready: ${LeagueTeams.find().count()} teams`);
      });
    });
    this.subscribe('poolTeams.single', this.getPoolTeamId(), () => {
      log.info(`poolTeams.single subscription ready`);
    });
  });
});

Template.poolTeamsEdit.onRendered(function() {
});

Template.poolTeamsEdit.onDestroyed(function() {
});


AutoForm.hooks({
  updatePoolTeamForm: {
    onSuccess: (operation, doc) => {
      FlowRouter.go('poolsShow', { _id: FlowRouter.getParam('poolId') });
    },
  },
});
