import { Meteor } from 'meteor/meteor';
import utils from './seeds/utils';

Meteor.startup(() => {
  utils.initializeLeagues();
});
