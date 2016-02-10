Template.poolsRecordsPoolUsersMostAllTime.helpers({
  poolId: () => Template.instance().getPoolId(),

  poolUsers: () => {
    let collection;
    switch (Template.currentData().metric) {
      case 'totalWins': { collection = PoolUsersMostWinsAllTime; break; }
      case 'totalLosses': { collection = PoolUsersMostLossesAllTime; break; }
      case 'totalPlusMinus': { collection = PoolUsersMostPlusMinusAllTime; break; }
    }

    return collection.find({}, { sort: { metric: -1 } });
  },

  metricTitle: () => _.capitalize(Template.currentData().metric),
});

Template.poolsRecordsPoolUsersMostAllTime.onCreated(function() {
  this.getPoolId = () => FlowRouter.getParam('_id');

  this.autorun(() => {
    this.subscribe('poolUsersMostAllTime.ofPool', this.getPoolId(), Template.currentData().metric);
  });
});
