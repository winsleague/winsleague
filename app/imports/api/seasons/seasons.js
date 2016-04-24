import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

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
  endDate: {
    type: Date,
  },
  status: {
    type: String,
    allowedValues: ['scheduled', 'in progress', 'completed'],
    defaultValue: 'scheduled',
  },
});

Seasons.attachSchema(Seasons.schema);

Seasons.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});
