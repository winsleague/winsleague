import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const LeagueTeams = new Mongo.Collection('league_teams');

LeagueTeams.schema = new SimpleSchema({
  leagueId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  cityName: {
    type: String,
  },
  mascotName: {
    type: String,
  },
  abbreviation: {
    type: String,
  },
  conference: {
    type: String,
    allowedValues: ['AFC', 'NFC', 'East', 'West', 'American', 'National'],
  },
  division: {
    type: String,
    allowedValues: [
      'North', 'South', 'East', 'West',
      'Atlantic', 'Pacific', 'Northwest', 'Southeast', 'Southwest', 'Central',
    ],
  },
});

LeagueTeams.attachSchema(LeagueTeams.schema);

LeagueTeams.helpers({
  fullName() {
    return `${this.cityName} ${this.mascotName}`;
  },
});

LeagueTeams.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});
