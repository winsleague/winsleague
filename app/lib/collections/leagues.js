Leagues = new Mongo.Collection('leagues');

Leagues.attachSchema(new SimpleSchema({
  name: { type: String },
  seasonGameCount: { type: Number },
}));

if (Meteor.isServer) {
  Leagues.allow({
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
