import { Template } from 'meteor/templating';
import { _ } from 'lodash';
import store from 'store';

import { Pools } from '../../../api/pools/pools';

import './previous_pool.html';

Template.previousPool.helpers({
  hasPreviousPool: () => !!Template.instance().getPoolId(),

  poolId: () => Template.instance().getPoolId(),

  poolName: () => _.get(Pools.findOne(Template.instance().getPoolId()), 'name'),
});

Template.previousPool.onCreated(function () {
  this.getPoolId = () => store.get('previousPoolId');

  this.autorun(() => {
    this.subscribe('pools.single', this.getPoolId());
  });
});
