import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import 'meteor/dburles:collection-helpers';

import { Leagues } from '../leagues/leagues';

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

Seasons.helpers({
  league() {
    return Leagues.findOne(this.leagueId);
  },
});
