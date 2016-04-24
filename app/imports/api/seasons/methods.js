import { Meteor } from 'meteor/meteor';
import { log } from '../../startup/log';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Seasons } from './seasons';

export const getByYear = new ValidatedMethod({
  name: 'seasons.getByYear',
  validate: new SimpleSchema({
    league: {
      type: Object,
    },
    year: {
      type: Number,
      defaultValue: (new Date()).getFullYear(),
    },
  }).validator(),
  run({ league, year }) {
    return Seasons.findOne({ leagueId: league._id, year });
  },
});

export const getLatestByLeague = new ValidatedMethod({
  name: 'seasons.getLatestByLeague',
  validate: new SimpleSchema({
    league: {
      type: Object,
    },
  }).validator(),
  run({ league }) {
    return Seasons.findOne(league._id, { sort: { year: -1 } });
  },
});

export const getLatestByLeagueId = new ValidatedMethod({
  name: 'seasons.getLatestByLeagueId',
  validate: new SimpleSchema({
    leagueId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
    },
  }).validator(),
  run({ leagueId }) {
    return Seasons.findOne({ leagueId }, { sort: { year: -1 } });
  },
});

export const getLatestCursorByLeagueId = new ValidatedMethod({
  name: 'seasons.getLatestCursorByLeagueId',
  validate: new SimpleSchema({
    leagueId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
    },
  }).validator(),
  run({ leagueId }) {
    return Seasons.find({ leagueId }, { sort: { year: -1 }, limit: 1 });
  },
});
