Template.poolsRecordsPoolUsersMostAllTime.helpers({
  poolUsers: () => {
    const collection = Modules.collectionCache.getCollection(Template.currentData().collectionName);
    const sort = Template.currentData().sort;
    return collection.find({}, { sort: { metric: sort }, limit: 3 });
  },
});

Template.poolsRecordsPoolUsersMostAllTime.onCreated(function () {
  new SimpleSchema({
    poolId: { type: String },
    recordTitle: { type: String },
    metricTitle: { type: String },
    metricField: { type: String },
    sort: { type: Number, allowedValues: [1, -1] },
    collectionName: { type: String },
  }).validate(this.data);

  this.autorun(() => {
    this.subscribe('poolUsersMostAllTime.ofPool', this.data.poolId, this.data.metricField, this.data.collectionName);
  });
});
