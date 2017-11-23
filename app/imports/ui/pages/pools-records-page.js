import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'lodash';
import log from '../../utils/log';

import './pools-records-page.html';

import '../components/pools-header';
import '../components/pools-records-pool-team-picks-most-season';
import '../components/pools-records-pool-teams-most-season';
import '../components/pools-records-pool-teams-most-week';
import '../components/pools-records-pool-users-most-all-time';
import '../components/pools-season-switcher';

import { Pools } from '../../api/pools/pools';

Template.Pools_records_page.helpers({
  poolId: () => Template.instance().getPoolId(),

  poolName: () => _.get(Template.instance().getPool(), 'name'),
});

Template.Pools_records_page.onCreated(function () {
  this.getPoolId = () => FlowRouter.getParam('poolId');

  this.getPool = () => Pools.findOne(this.getPoolId());

  this.autorun(() => {
    this.subscribe('pools.single', this.getPoolId(), () => {
      log.debug(`pools.single subscription ready: ${Pools.find(this.getPoolId()).count()}`);
      if (Pools.find(this.getPoolId()).count() === 0) {
        log.warn('poolsRecords: Redirecting to /?force=true because Pools.count=0');
        FlowRouter.go('/?force=true');
      }
    });
  });
});
