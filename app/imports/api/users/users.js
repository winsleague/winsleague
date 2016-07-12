import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';

Factory.define('user', Meteor.users, {});

Factory.define('commissionerUser', Meteor.users, {});
