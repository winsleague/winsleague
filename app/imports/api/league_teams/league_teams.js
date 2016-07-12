import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Factory } from 'meteor/dburles:factory';
import faker from 'faker';

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

Factory.define('leagueTeam', LeagueTeams, {
  leagueId: Factory.get('league'),
  cityName: () => faker.address.city(),
  mascotName: () => faker.company.companyName(),
  abbreviation: () => faker.company.catchPhrase(),
  conference: 'NFC',
  division: 'East',
});

Factory.define('awayLeagueTeam', LeagueTeams, {
  leagueId: Factory.get('league'),
  cityName: () => faker.address.city(),
  mascotName: () => faker.company.companyName(),
  abbreviation: () => faker.company.catchPhrase(),
  conference: 'AFC',
  division: 'South',
});
