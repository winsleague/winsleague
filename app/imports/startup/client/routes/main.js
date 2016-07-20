import log from '../../../utils/log';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import '../../../ui/pages/home_page';
import '../../../ui/pages/app-not-found';

log.info('Setting up main routes');

FlowRouter.route('/', {
  name: 'App.home',
  action() {
    BlazeLayout.render('App_body', { content: 'Home_page' });
  },
});

FlowRouter.notFound = {
  action() {
    BlazeLayout.render('App_body', { content: 'App_notFound' });
  },
};
