Pools = new Mongo.Collection('pools');

Pools.attachSchema(new SimpleSchema({
  leagueId: {
    type: String,
    label: "League",
    autoform: {
      type: "select-radio-inline"
    }
  },
  seasonId: { type: String },
  name: { type: String, max: 50 }
}));

if (Meteor.isServer) {
  Pools.allow({
    insert: function (userId, doc) {
      return false;
    },

    update: function (userId, doc, fieldNames, modifier) {
      return false;
    },

    remove: function (userId, doc) {
      return false;
    }
  });

  Pools.deny({
    insert: function (userId, doc) {
      return true;
    },

    update: function (userId, doc, fieldNames, modifier) {
      return true;
    },

    remove: function (userId, doc) {
      return true;
    }
  });
}
