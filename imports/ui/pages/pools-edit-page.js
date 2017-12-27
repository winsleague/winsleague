import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { AutoForm } from 'meteor/aldeed:autoform';
import log from '../../utils/log';

import './pools-edit-page.html';
import '../components/delete-modal';

import { Pools } from '../../api/pools/pools';

Template.Pools_edit_page.helpers({
  pools: () => Pools,

  poolId: () => Template.instance().getPoolId(),

  poolDoc: () => Template.instance().getPoolDoc(),

  onDelete: () => {
    return () => {
      log.debug('onRemoveSuccess called');

      Pools.remove(FlowRouter.getParam('poolId'));

      FlowRouter.go('/?force=true');
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
        log.warn('poolsEdit: Redirecting to /?force=true because Pools.count=0');
        FlowRouter.go('/?force=true');
      }
    });
  });
});


Template.Pools_edit_page.events({
  'click #delete': function (event) {
    event.preventDefault();

    $('#deleteModal').modal('show');
  },
});


AutoForm.hooks({
  updatePoolForm: {
    onSuccess: (formType, result) => {
      log.debug('redirect to poolsShow', FlowRouter.getParam('poolId'));
      return FlowRouter.go('Pools.show', { poolId: FlowRouter.getParam('poolId') });
    },
  },
});
