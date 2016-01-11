Games = new Mongo.Collection('games');

Games.attachSchema(new SimpleSchema({
  leagueId: { type: String },
  seasonId: { type: String },
  gameId: { type: Number },
  gameDate: { type: Date },
  week: { type: Number, optional: true }, // only for NFL
  homeTeamId: { type: String },
  homeScore: { type: Number, optional: true },
  awayTeamId: { type: String },
  awayScore: { type: Number, optional: true },
  status: {
    type: String,
    allowedValues: ["scheduled", "in progress", "completed", "postponed", "suspended", "cancelled"]
  },
  period: { // quarter if NFL or NBA, inning if MLB, period if NHL
    type: String,
    allowedValues: ["pregame", "1", "2", "halftime", "3", "4", "overtime", "final", "final overtime"]
  },
  timeRemaining: { type: String, optional: true },
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
  }
}));


/* Hooks */
Games.after.insert(function (userId, doc) {
  Modules.server.seasonLeagueTeams.refreshTeamStats(doc.leagueId, doc.seasonId, doc.homeTeamId);
  Modules.server.seasonLeagueTeams.refreshTeamStats(doc.leagueId, doc.seasonId, doc.awayTeamId);
});

Games.after.update(function (userId, doc, fieldNames, modifier, options) {
  Modules.server.seasonLeagueTeams.refreshTeamStats(doc.leagueId, doc.seasonId, doc.homeTeamId);
  Modules.server.seasonLeagueTeams.refreshTeamStats(doc.leagueId, doc.seasonId, doc.awayTeamId);
}, { fetchPrevious: false });


/* Access control */
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
