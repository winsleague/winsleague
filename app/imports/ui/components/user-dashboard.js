import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import log from '../../startup/log';

import { Pools } from '../../api/pools/pools';

import './user-dashboard.html';

import './pools-wins';

Template.User_dashboard.helpers({
  pools: () => Pools.find({}, { sort: { updatedAt: -1, createdAt: -1 } }),

  poolNameLink: (pool) => `<a href="/pools/${pool._id}">${pool.name}</a>`,
});

Template.User_dashboard.onCreated(function () {
  this.autorun(() => {
    this.subscribe('pools.ofUser', Meteor.userId(), () => {
      log.debug(`pools.of_user subscription ready: ${Pools.find().count()} pools`);
    });
  });
});
