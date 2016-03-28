Template.poolsShowWins.helpers({
  poolTeams: () => {
    const seasonId = Template.instance().getSeasonId();
    const poolId = Template.currentData().poolId;
    return PoolTeams.find({ poolId, seasonId }, { sort: { totalWins: -1, totalPlusMinus: -1 } });
  },
  title: () => Template.currentData().title,
});

Template.poolsShowWins.onCreated(function () {
  new SimpleSchema({
    title: { type: String, optional: true, defaultValue: 'Wins Leaderboard' },
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
