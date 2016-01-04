Games = new Mongo.Collection('games');

Games.attachSchema(new SimpleSchema({
  leagueId: { type: String },
  seasonId: { type: String },
  week: { type: Number },
  eid: { type: Number },
  gsis: { type: Number },
  day: { type: String, allowedValues: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] },
  time: { type: String },
  quarter: {
    type: String,
    allowedValues: ["Pregame", "1", "2", "3", "4", "OT?", "Final", "Final Overtime"],
    autoValue: function() {
      if (this.isInsert) {
        if (this.value == "P") { return "Pregame"; }
        if (this.value == "F") { return "Final"; }
        if (this.value == "FO") { return "Final Overtime"; }
      }
    }
  },
  homeTeamId: { type: String },
  homeScore: { type: Number, optional: true },
  visitorTeamId: { type: String },
  visitorScore: { type: Number, optional: true }
}));

if (Meteor.isServer) {
  Games.allow({
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

  Games.deny({
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
