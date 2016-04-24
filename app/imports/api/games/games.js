import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import './server/hooks';

export const Games = new Mongo.Collection('games');

Games.schema = new SimpleSchema({
  leagueId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  seasonId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  gameId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  gameDate: {
    type: Date,
  },
  week: {
    type: Number,
    optional: true,
  }, // only for NFL
  homeTeamId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  homeScore: {
    type: Number,
    optional: true,
  },
  awayTeamId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  awayScore: {
    type: Number,
    optional: true,
  },
  status: {
    type: String,
    allowedValues: ['scheduled', 'in progress', 'completed', 'postponed', 'suspended', 'cancelled'],
  },
  period: { // quarter if NFL or NBA, inning if MLB, period if NHL
    type: String,
    allowedValues: ['pregame', '1', '2', 'halftime', '3', '4',
      '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
      'overtime', 'final', 'final overtime'],
  },
  timeRemaining: {
    type: String,
    optional: true,
  },
  createdAt: {
    // Force value to be current date (on server) upon insert
    // and prevent updates thereafter.
    type: Date,
    autoValue() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return { $setOnInsert: new Date() };
      }
      this.unset();  // Prevent user from supplying their own value
    },
  },
  updatedAt: {
    // Force value to be current date (on server) upon update
    // and don't allow it to be set upon insert.
    type: Date,
    autoValue() {
      if (this.isUpdate) {
        return new Date();
      }
    },
    denyInsert: true,
    optional: true,
  },
});

Games.attachSchema(Games.schema);

// Deny all client-side updates since we will be using methods to manage this collection
Games.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

