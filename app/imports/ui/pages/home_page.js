import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './home_page.html';

import './../components/home/dashboard';
import './../components/home/previous_pool';
import './../components/home/intro';

Template.Home_page.helpers({
  isLoggedIn: () => !!Meteor.user(),
});
