Template.poolsShowWins.helpers({
  poolTeams: () => {
    const poolId = Template.currentData().poolId;
    return PoolTeams.find({ poolId }, { sort: { totalWins: -1, totalPlusMinus: -1 } });
  },

  editAllowed: (poolTeam) => {
    return (Meteor.userId() === poolTeam.userId ||
      Template.currentData().isCommissioner);
  },
});

Template.poolsShowWins.onCreated(function() {
  new SimpleSchema({
    poolId: { type: String },
    seasonId: { type: String },
    isCommissioner: { type: Boolean },
  }).validate(this.data);

  this.autorun(() => {
    this.subscribe('poolTeams.ofPool', this.data.poolId, this.data.seasonId, () => {
      log.debug(`poolTeams.of_pool subscription ready: ${PoolTeams.find().count()}`);
    });
  });
});
