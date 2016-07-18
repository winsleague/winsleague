import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Factory } from 'meteor/dburles:factory';
import log from '../../startup/log';

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

Factory.define('leaguePickExpectedWin', LeaguePickExpectedWins, {
  leagueId: Factory.get('league'),
}).after(leaguePickExpectedWin => {
  log.debug('leaguePickExpectedWin factory created:', leaguePickExpectedWin);
});
