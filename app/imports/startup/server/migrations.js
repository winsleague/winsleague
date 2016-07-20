import log from '../../utils/log';
import { Migrations } from 'meteor/percolate:migrations';

Meteor.startup(() => {
  Migrations.config({ logger: log });
  Migrations.migrateTo('latest');
});
