import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './home.html';

import './dashboard';
import './previous_pool';
import './intro';

Template.home.helpers({
  isLoggedIn: () => !!Meteor.user(),
});
