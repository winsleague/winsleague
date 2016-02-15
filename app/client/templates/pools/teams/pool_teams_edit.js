Template.poolTeamsEdit.helpers({
  poolId: () => Template.instance().getPoolId(),

  poolTeamDoc: () => Template.instance().getPoolTeamDoc(),

  onRemoveSuccess: () => {
    // check to see if doc exists because of https://github.com/yogiben/meteor-autoform-modals/issues/79
    if (! Template.instance().getPoolTeamDoc()) {
      $('.modal-backdrop').hide(); // https://github.com/yogiben/meteor-autoform-modals/issues/65
      FlowRouter.go('poolsShow', { _id: Template.instance().getPoolId() });
    }
  },
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


AutoForm.hooks({
  updatePoolTeamForm: {
    onSuccess: (formType, result) => {
      FlowRouter.go('poolsShow', { _id: FlowRouter.getParam('poolId') });
    },
  },
});
