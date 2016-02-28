Template.poolTeamsShow.helpers({
  poolId: () => Template.instance().getPoolId(),

  poolTeamId: () => Template.instance().getPoolTeamId(),

  seasonId: () => Template.instance().getSeasonId(),

  poolTeamName: () => _.get(Template.instance().getPoolTeam(), 'userTeamName'),

  poolTeamPicks: () => {
    const poolTeamId = Template.instance().getPoolTeamId();
    return PoolTeamPicks.find({ poolTeamId }, { sort: { pickNumber: 1 } });
  },

  isCommissioner: () => Meteor.userId() === _.get(Template.instance().getPool(), 'commissionerUserId'),

  editAllowed: () => {
    const poolTeam = Template.instance().getPoolTeam();
    const pool = Template.instance().getPool();
    return (Meteor.userId() === poolTeam.userId ||
      Meteor.userId() === _.get(pool, 'commissionerUserId'));
  },

  leagueTeamName: (leagueTeamId) => {
    return LeagueTeams.findOne(leagueTeamId).fullName();
  },
});

Template.poolTeamsShow.onCreated(function() {
  this.getPoolId = () => FlowRouter.getParam('poolId');
  this.getPool = () => Pools.findOne(this.getPoolId());

  this.getPoolTeamId = () => FlowRouter.getParam('poolTeamId');
  this.getPoolTeam = () => PoolTeams.findOne(this.getPoolTeamId());

  this.getLeagueId = () => _.get(this.getPool(), 'leagueId');

  this.getSeasonId = () => _.get(this.getPool(), 'seasonId');

  this.autorun(() => {
    this.subscribe('poolTeams.single', this.getPoolTeamId(), () => {
      log.debug(`poolTeams.single subscription ready: ${PoolTeams.find(this.getPoolTeamId()).count()}`);
    });

    this.subscribe('poolTeamPicks.ofPoolTeam', this.getPoolTeamId());

    this.subscribe('pools.single', this.getPoolId(), () => {
      this.subscribe('seasons.single', this.getSeasonId());

      this.subscribe('seasons.latest.ofLeague', this.getLeagueId());

      this.subscribe('leagueTeams.ofLeague', this.getLeagueId());
    });
  });
});
