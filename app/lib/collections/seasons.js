Seasons = new Mongo.Collection('seasons');

Seasons.attachSchema(new SimpleSchema({
  leagueId: { type: String },
  year: { type: Number },
  startDate: { type: Date },
  endDate: { type: Date },
  status: {
    type: String,
    allowedValues: ['scheduled', 'in progress', 'completed'],
    defaultValue: 'scheduled',
  },
}));

if (Meteor.isServer) {
  Seasons.allow({
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
