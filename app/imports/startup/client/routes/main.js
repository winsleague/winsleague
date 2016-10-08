import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import store from 'store';
import log from '../../../utils/log';

import '../../../ui/pages/home_page';
import '../../../ui/pages/user-dashboard';
import '../../../ui/pages/app-not-found';

log.info('Setting up main routes');

function storeLastUrl(context) {
  // need to allow users to go home when they want to, but redirect when they don't
  if (context.path !== '/') {
    store.set('lastUrl', context.path);
  }
}

function redirectToLastUrl(context) {
  if (context.queryParams.force) {
    // don't redirect
    return;
  }

  const url = store.get('lastUrl');
  if (url && url !== '/?force=true') {
    FlowRouter.redirect(url);
  }
}

FlowRouter.triggers.enter([storeLastUrl]);

FlowRouter.route('/', {
  name: 'App.home',
  triggersEnter: [redirectToLastUrl],
  action() {
    Tracker.autorun(() => {
      if (!Meteor.userId()) {
        BlazeLayout.render('App_body', { content: 'Home_page' });
      } else {
        BlazeLayout.render('App_body', { content: 'User_dashboard' });
      }
    });
  },
});

FlowRouter.notFound = {
  action() {
    BlazeLayout.render('App_body', { content: 'App_notFound' });
  },
};

