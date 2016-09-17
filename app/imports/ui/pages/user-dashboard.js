import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import log from '../../utils/log';

import { Pools } from '../../api/pools/pools';

import './user-dashboard.html';

import '../components/pools-wins';

Template.User_dashboard.helpers({
  pools: () => Pools.find({}, { sort: { updatedAt: -1, createdAt: -1 } }),

  poolNameLink: (pool) => `<a href="/pools/${pool._id}">${pool.name}</a>`,
});

Template.User_dashboard.onCreated(function () {
  this.autorun(() => {
    this.subscribe('pools.ofUserAsCommissioner', Meteor.userId(), () => {
      log.debug(`pools.ofUserAsCommissioner subscription ready: ${Pools.find().count()} pools`);
    });

    this.subscribe('pools.ofUserPoolTeams', Meteor.userId(), () => {
      log.debug(`pools.ofUserPoolTeams subscription ready: ${Pools.find().count()} pools`);
    });
  });
});
