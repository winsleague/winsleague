LeagueTeams = new Mongo.Collection('league_teams');

LeagueTeams.attachSchema(new SimpleSchema({
  leagueId: { type: String },
  cityName: { type: String },
  mascotName: { type: String },
  abbreviation: { type: String },
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
}));

LeagueTeams.helpers({
  fullName() {
    return this.cityName + ' ' + this.mascotName;
  },
});

if (Meteor.isServer) {
  LeagueTeams.allow({
    insert(userId, doc) {
      return false;
    },

    update(userId, doc, fieldNames, modifier) {
      return false;
    },

    remove(userId, doc) {
      return false;
    },
  });
}
