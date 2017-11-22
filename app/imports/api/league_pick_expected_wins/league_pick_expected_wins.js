import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const LeaguePickExpectedWins = new Mongo.Collection('league_pick_expected_wins');

LeaguePickExpectedWins.schema = new SimpleSchema({
  leagueId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  rank: {
    type: Number,
  },
  wins: {
    type: Number,
    decimal: true,
  },
});

LeaguePickExpectedWins.attachSchema(LeaguePickExpectedWins.schema);

LeaguePickExpectedWins.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});
