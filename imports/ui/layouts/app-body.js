import './app-body.html';

import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Template } from 'meteor/templating';
import log from '../../utils/log';

import '../components/pools-menu';

Template.App_body.onRendered(function () {
  this.autorun(() => {
    FlowRouter.watchPathChange();
    const currentContext = FlowRouter.current();
    log.info('currentPath:', currentContext.path);
  });
});

Template.App_body.events({
  'click .menuLink'(event) {
    $('.navbar-toggle').click();
  },
});
