import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import log from '../../startup/log';

import { Pools } from '../../api/pools/pools';

import './pools-menu.html';

Template.Pools_menu.helpers({
  canShow: () => !!Meteor.user(),

  pools: () => Pools.find(),
});

Template.Pools_menu.onCreated(function () {
  this.autorun(() => {
    this.subscribe('pools.ofUser', Meteor.userId(), () => {
      log.debug(`pools.of_user subscription ready: ${Pools.find().count()} pools`);
    });
  });
});
