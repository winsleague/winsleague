import { Meteor } from 'meteor/meteor';
import Utils from './seeds/utils';

Meteor.startup(() => {
  Utils.initializeLeagues();
});
