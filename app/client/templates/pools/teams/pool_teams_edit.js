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
      log.debug(`pools.single subscription ready: ${Pools.find(this.getPoolId()).count()} pools`);
      if (Pools.find(this.getPoolId()).count() === 0) {
        FlowRouter.go('/');
        return;
      }
      this.subscribe('leagueTeams.ofLeague', this.getLeagueId(), () => {
        log.debug(`leagueTeams subscription ready: ${LeagueTeams.find().count()} teams`);
      });
    });
    this.subscribe('poolTeams.single', this.getPoolTeamId(), () => {
      log.debug(`poolTeams.single subscription ready`);
      if (PoolTeams.find({ poolId: this.getPoolId() }).count() === 0) {
        FlowRouter.go('poolsShow', { _id: this.getPoolId() });
      }
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
