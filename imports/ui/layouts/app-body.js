import './app-body.html';

import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import log from '../../utils/log';
import { Template } from 'meteor/templating';
import { atNavButton } from 'meteor/useraccounts:bootstrap';

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
