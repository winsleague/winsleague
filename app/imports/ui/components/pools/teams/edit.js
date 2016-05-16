Template.poolTeamsEdit.helpers({
  poolId: () => Template.instance().getPoolId(),

  poolTeamId: () => Template.instance().getPoolTeamId(),

  poolTeamDoc: () => Template.instance().getPoolTeamDoc(),

  onRemoveSuccess: () => {
    return () => {
      $('.modal-backdrop').hide(); // https://github.com/yogiben/meteor-autoform-modals/issues/65
      FlowRouter.go('Pools.show', { poolId: FlowRouter.getParam('poolId') });
    };
  },
});

Template.poolTeamsEdit.onCreated(function () {
  this.getPoolId = () => FlowRouter.getParam('poolId');

  this.getPoolTeamId = () => FlowRouter.getParam('poolTeamId');

  this.getLeagueId = () => Pools.findOne(this.getPoolId(), { fields: { leagueId: 1 } }).leagueId;

  this.getPoolTeamDoc = () => PoolTeams.findOne(this.getPoolTeamId());

  this.autorun(() => {
    this.subscribe('pools.single', this.getPoolId(), () => {
      log.debug(`pools.single subscription ready: ${Pools.find(this.getPoolId()).count()} pools`);
      if (Pools.find(this.getPoolId()).count() === 0) {
        log.warn(`poolTeamsEdit: redirecting to / because no Pools found for `, this.getPoolId());
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
        log.warn('poolTeamsEdit: Redirecting to poolsShow because PoolTeams.count=0');
        FlowRouter.go('Pools.show', { poolId: this.getPoolId() });
      }
    });
  });
});


AutoForm.hooks({
  updatePoolTeamForm: {
    onSuccess: () => {
      log.debug(`updatePoolTeamForm.onSuccess() ==> redirect to poolTeamsShow/`,
        FlowRouter.getParam('poolId'));
      FlowRouter.go('poolTeamsShow', {
        poolId: FlowRouter.getParam('poolId'),
        poolTeamId: FlowRouter.getParam('poolTeamId'),
      });
    },
  },
});
