import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
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
  // needed because iOS always opens to / even though user may have been on another page

  if (context.queryParams.force) {
    // don't redirect
    return;
  }

  const url = store.get('lastUrl');
  if (url && url !== '/?force=true' && url !== '/sign-in') {
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

