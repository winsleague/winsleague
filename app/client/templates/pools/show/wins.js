Template.poolsShowWins.helpers({
  poolTeams: () => {
    const seasonId = Template.currentData().seasonId;
    const poolId = Template.currentData().poolId;
    return PoolTeams.find({ poolId, seasonId }, { sort: { totalWins: -1, totalPlusMinus: -1 } });
  },
});

Template.poolsShowWins.onCreated(function() {
  new SimpleSchema({
    seasonId: { type: String },
    poolId: { type: String },
    isCommissioner: { type: Boolean },
  }).validate(this.data);

  this.autorun(() => {
    this.subscribe('poolTeams.ofPool', this.data.poolId, this.data.seasonId, () => {
      log.debug(`poolTeams.of_pool subscription ready: ${PoolTeams.find().count()}`);
    });
  });
});
