import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import log from '../../utils/log';

import { Pools } from '../../api/pools/pools';

import './pools-menu.html';

Template.Pools_menu.helpers({
  canShow: () => !!Meteor.user(),

  pools: () => Pools.find(),
});

Template.Pools_menu.onCreated(function () {
  this.autorun(() => {
    this.subscribe('pools.ofUserAsCommissioner', Meteor.userId(), () => {
      log.debug(`pools.ofUserAsCommissioner subscription ready: ${Pools.find().count()} pools`);
    });

    this.subscribe('pools.ofUserPoolTeams', Meteor.userId(), () => {
      log.debug(`pools.ofUserPoolTeams subscription ready: ${Pools.find().count()} pools`);
    });
  });
});
