import { Meteor } from 'meteor/meteor';

import { Leagues } from '../leagues';

Meteor.publish('leagues.list', () => Leagues.find());
