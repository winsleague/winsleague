import './app-body.html';

import { Template } from 'meteor/templating';
import { ActiveRoute } from 'meteor/zimme:active-route';
import { atNavButton } from 'meteor/useraccounts:bootstrap';

import '../components/pools-menu';

Template.App_body.events({
  // so we close the navbar dropdown when a link in it is clicked
  'click .nav-link-toggle'(event) {
    $('.navbar-toggler').click();
  },
});
