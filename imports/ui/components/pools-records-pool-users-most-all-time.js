import { Template } from 'meteor/templating';
import SimpleSchema from 'simpl-schema';

import CollectionCache from '../../api/collection_cache';

import './pools-records-pool-users-most-all-time.html';

Template.Pools_records_pool_users_most_all_time.helpers({
  poolUsers: () => {
    const collection = CollectionCache.getCollection(Template.currentData().collectionName);
    const { sort } = Template.currentData();
    return collection.find(
      {}, // don't filter by PoolId because we're only pulling from aggregate result
      {
        sort: {
          metric: sort,
        },
        limit: 10,
      },
    );
  },

  roundedMetric: (metric) => {
    if (Template.currentData().round) {
      return metric.toFixed(1);
    }
    return metric;
  },
});

Template.Pools_records_pool_users_most_all_time.onCreated(function () {
  new SimpleSchema({
    poolId: { type: String },
    recordTitle: { type: String },
    metricTitle: { type: String },
    metricField: { type: String },
    sort: { type: SimpleSchema.Integer, allowedValues: [1, -1] },
    round: { type: Boolean, optional: true, defaultValue: false },
    collectionName: { type: String },
  }).validate(this.data);

  this.autorun(() => {
    this.subscribe('poolUsersMostAllTime.ofPool', this.data.poolId, this.data.metricField, this.data.collectionName);
  });
});
