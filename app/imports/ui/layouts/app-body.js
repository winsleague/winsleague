import './app-body.html';

import { Template } from 'meteor/templating';
import { ActiveRoute } from 'meteor/zimme:active-route';
import { atNavButton } from 'meteor/useraccounts:bootstrap';

import '../components/pools-menu';

Template.App_body.events({
  'click .menuLink'(event) {
    $('.navbar-toggle').click();
  },
});
