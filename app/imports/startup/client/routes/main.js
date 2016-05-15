import log from '../../log';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import '../../../ui/pages/home_page';
import '../../../ui/pages/app-not-found';

log.info('setup main routes');

FlowRouter.route('/', {
  action() {
    BlazeLayout.render('App_body', { content: 'Home_page' });
  },
});

FlowRouter.notFound = {
  action() {
    BlazeLayout.render('App_body', { content: 'App_notFound' });
  },
};
