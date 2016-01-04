NflGames = new Mongo.Collection('nfl_games');

NflGames.attachSchema(new SimpleSchema({
  leagueId: { type: String },
  seasonId: { type: String },
  week: { type: Number },
  eid: { type: Number }, // a date representation (e.g. 2016010302)
  gsis: { type: Number }, // a game ID used by the NFL
  day: { type: String, allowedValues: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] },
  time: { type: String },
  quarter: {
    type: String,
    allowedValues: ["Pregame", "1", "2", "Halftime", "3", "4", "OT?", "Final", "Final Overtime"],
    autoValue: function() {
      if (this.value == "P") { return "Pregame"; }
      if (this.value == "F") { return "Final"; }
      if (this.value == "FO" || this.value == "final overtime") { return "Final Overtime"; }
    }
  },
  timeRemaining: { type: String, optional: true },
  homeTeamId: { type: String },
  homeScore: { type: Number, optional: true },
  visitorTeamId: { type: String },
  visitorScore: { type: Number, optional: true },
  createdAt: {
    // Force value to be current date (on server) upon insert
    // and prevent updates thereafter.
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date()};
      } else {
        this.unset();  // Prevent user from supplying their own value
      }
    }
  },
  updatedAt: {
    // Force value to be current date (on server) upon update
    // and don't allow it to be set upon insert.
    type: Date,
    autoValue: function() {
      if (this.isUpdate) {
        return new Date();
      }
    },
    denyInsert: true,
    optional: true
  },
}));

if (Meteor.isServer) {
  NflGames.allow({
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

  NflGames.deny({
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
