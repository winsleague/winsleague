Template.poolTeamPicksNew.helpers({
  poolId: () => Template.instance().getPoolId(),

  poolTeamId: () => Template.instance().getPoolTeamId(),

  seasonId: () => Template.instance().getSeasonId(),
});

Template.poolTeamPicksNew.onCreated(function() {
  this.getPoolId = () => FlowRouter.getParam('poolId');
  this.getPool = () => Pools.findOne(this.getPoolId());

  this.getPoolTeamId = () => FlowRouter.getParam('poolTeamId');
  this.getPoolTeam = () => PoolTeams.findOne(this.getPoolTeamId());

  this.getLeagueId = () => _.get(this.getPoolTeam(), 'leagueId');

  this.getSeasonId = () => _.get(this.getPoolTeam(), 'seasonId');

  this.autorun(() => {
    this.subscribe('poolTeams.single', this.getPoolTeamId(), () => {
      log.debug(`poolTeams.single subscription ready: ${PoolTeams.find(this.getPoolTeamId()).count()}`);
      this.subscribe('pools.single', this.getPoolId(), () => {
        this.subscribe('leagueTeams.ofLeague', this.getLeagueId());
      });

      this.subscribe('seasons.single', this.getSeasonId(), () => {
        log.debug(`seasons.single ready: ${this.getSeasonId()} ${Seasons.find(this.getSeasonId()).count()}`);
      });
    });

    this.subscribe('poolTeamPicks.ofPoolTeam', this.getPoolTeamId());
  });
});


AutoForm.hooks({
  insertPoolTeamPickForm: {
    onSuccess: (formType, poolTeamPickId) => {
      FlowRouter.go('poolTeamsShow', {
        poolId: FlowRouter.getParam('poolId'),
        poolTeamId: FlowRouter.getParam('poolTeamId'),
      });
    },
  },
});
