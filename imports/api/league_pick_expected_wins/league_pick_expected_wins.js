import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const LeaguePickExpectedWins = new Mongo.Collection('league_pick_expected_wins');

LeaguePickExpectedWins.schema = new SimpleSchema({
  leagueId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  rank: {
    type: SimpleSchema.Integer,
  },
  wins: {
    type: SimpleSchema.Integer,
  },
});

LeaguePickExpectedWins.attachSchema(LeaguePickExpectedWins.schema);

LeaguePickExpectedWins.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});
