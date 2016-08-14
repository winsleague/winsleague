import { Meteor } from 'meteor/meteor';
import { Migrations } from 'meteor/percolate:migrations';
import log from '../../utils/log';

Meteor.startup(() => {
  Migrations.config({ logger: log });
  if (!Meteor.isTest && !Meteor.isAppTest) {
    Migrations.migrateTo('latest');
  }
});
