import './app-body.html';

import { Template } from 'meteor/templating';
import { ActiveRoute } from 'meteor/zimme:active-route';

import '../components/app-body/pools_menu';

Template.App_body.events({
  'click .menuLink'(event) {
    $('.navbar-toggle').click();
  },
});
