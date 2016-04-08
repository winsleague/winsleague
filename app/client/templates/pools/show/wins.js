Template.poolsShowWins.helpers({
  poolTeams: () => {
    const seasonId = Template.instance().getSeasonId();
    const poolId = Template.currentData().poolId;
    return PoolTeams.find({ poolId, seasonId }, {
      sort: {
        totalWins: -1,
        totalGames: 1, // if two teams are tied in wins, rank the one with fewest games played higher
        totalPlusMinus: -1,
      },
    });
  },
  title: () => {
    const title = Template.currentData().title;
    if (Template.currentData().linkTitle) {
      const path = FlowRouter.path('poolsShow', { poolId: Template.currentData().poolId });
      return `<a href="${path}">${title}</a>`;
    }
    return title;
  },
});

Template.poolsShowWins.onCreated(function () {
  new SimpleSchema({
    title: { type: String, optional: true, defaultValue: 'Wins Leaderboard' },
    linkTitle: { type: Boolean, optional: true, defaultValue: false },
    seasonId: { type: String, optional: true },
    poolId: { type: String },
    isCommissioner: { type: Boolean, optional: true, defaultValue: false },
  }).validate(this.data);

  this.getSeasonId = () => {
    if (this.data.seasonId) return this.data.seasonId;

    return this.getPool().latestSeasonId;
  };

  this.getPool = () => Pools.findOne(this.data.poolId);

  this.autorun(() => {
    this.subscribe('poolTeams.ofPool', this.data.poolId, this.data.seasonId, () => {
      log.debug(`poolTeams.of_pool subscription ready: ${PoolTeams.find().count()}`);
    });
  });
});
