import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { _ } from 'meteor/underscore';
import { Factory } from 'meteor/dburles:factory';
import 'meteor/dburles:collection-helpers';
import log from '../../utils/log';

import { Leagues } from '../leagues/leagues'; // needed for factory

export const Seasons = new Mongo.Collection('seasons');

Seasons.schema = new SimpleSchema({
  leagueId: {
    type: String,
  },
  year: {
    type: Number,
  },
  startDate: {
    type: Date,
  },
  endDate: { // this should be the day after the last game of the season
    type: Date,
  },
  status: {
    type: String,
    allowedValues: ['scheduled', 'in progress', 'completed'],
    defaultValue: 'scheduled',
  },
});

Seasons.attachSchema(Seasons.schema);

Seasons.allow({
  insert() { return Meteor.isAppTest; },
  update() { return false; },
  remove() { return false; },
});

Factory.define('season', Seasons, {
  leagueId: Factory.get('league'),
  year: () => _.random(2000, 2014),
  startDate: new Date(),
  endDate: new Date(),
  status: 'in progress',
}).after(factory => {
  log.debug('season factory created:', factory);
});

Seasons.helpers({
  league() {
    return Leagues.findOne(this.leagueId);
  },
});
