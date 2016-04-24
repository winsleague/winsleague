import { log } from '../../log';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

FlowRouter.route('/', {
  action() {
    BlazeLayout.render('masterLayout', { content: 'home' });
  },
});

FlowRouter.notFound = {
  action() {
    BlazeLayout.render('masterLayout', { content: 'App_notFound' });
  },
};
