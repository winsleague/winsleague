import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Pools } from '../../../api/pools/pools';

import './previous_pool.html';

Template.previousPool.helpers({
  hasPreviousPool: () => !!Template.instance().getPoolId(),

  poolId: () => Template.instance().getPoolId(),

  poolName: () => Pools.findOne(Template.instance().getPoolId()).name,
});

Template.previousPool.onCreated(function () {
  this.getPoolId = () => Session.get('previousPoolId');

  this.autorun(() => {
    this.subscribe('pools.single', this.getPoolId());
  });
});
