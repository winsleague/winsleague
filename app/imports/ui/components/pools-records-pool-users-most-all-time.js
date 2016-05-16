import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import CollectionCache from '../../api/collection_cache';

import './pools-records-pool-users-most-all-time.html';

Template.Pools_records_pool_users_most_all_time.helpers({
  poolUsers: () => {
    const collection = CollectionCache.getCollection(Template.currentData().collectionName);
    const sort = Template.currentData().sort;
    return collection.find({}, { sort: { metric: sort }, limit: 3 });
  },
});

Template.Pools_records_pool_users_most_all_time.onCreated(function () {
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
