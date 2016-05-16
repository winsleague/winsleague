import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { AutoForm } from 'meteor/aldeed:autoform';
import log from '../../startup/log';

import './pools-edit-page.html';

import { Pools } from '../../api/pools/pools';

Template.Pools_edit_page.helpers({
  pools: () => Pools,

  poolId: () => Template.instance().getPoolId(),

  poolDoc: () => Template.instance().getPoolDoc(),

  // TODO: removing doesn't work since 1.3 (https://github.com/yogiben/meteor-autoform-modals/issues/82)
  onRemoveSuccess: () => {
    return () => {
      log.debug('onRemoveSuccess called');
      $('.modal-backdrop').hide(); // https://github.com/yogiben/meteor-autoform-modals/issues/65
      log.debug('poolsEdit: onRemoveSuccess: redirect to /');
      FlowRouter.go('/');
    };
  },
});

Template.Pools_edit_page.onCreated(function () {
  this.getPoolId = () => FlowRouter.getParam('poolId');

  this.getPoolDoc = () => Pools.findOne(this.getPoolId());

  this.autorun(() => {
    this.subscribe('pools.single', this.getPoolId(), () => {
      log.debug(`pools.single subscription ready: ${Pools.find(this.getPoolId()).count()}`);
      if (Pools.find(this.getPoolId()).count() === 0) {
        log.warn('poolsEdit: Redirecting to / because Pools.count=0');
        FlowRouter.go('/');
      }
    });
  });
});


AutoForm.hooks({
  updatePoolForm: {
    onSuccess: (formType, result) => {
      log.debug('redirect to poolsShow', FlowRouter.getParam('poolId'));
      return FlowRouter.go('Pools.show', { poolId: FlowRouter.getParam('poolId') });
    },
  },
});
