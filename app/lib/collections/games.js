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
    allowedValues: ['scheduled', 'in progress', 'completed', 'postponed', 'suspended', 'cancelled'],
  },
  period: { // quarter if NFL or NBA, inning if MLB, period if NHL
    type: String,
    allowedValues: ['pregame', '1', '2', 'halftime', '3', '4',
      'overtime', 'final', 'final overtime'],
  },
  timeRemaining: { type: String, optional: true },
  createdAt: {
    // Force value to be current date (on server) upon insert
    // and prevent updates thereafter.
    type: Date,
    autoValue() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return { $setOnInsert: new Date() };
      }
      this.unset();  // Prevent user from supplying their own value
    },
  },
  updatedAt: {
    // Force value to be current date (on server) upon update
    // and don't allow it to be set upon insert.
    type: Date,
    autoValue() {
      if (this.isUpdate) {
        return new Date();
      }
    },
    denyInsert: true,
    optional: true,
  },
}));


/* Hooks */
Games.after.insert((userId, doc) => {
  Modules.server.seasonLeagueTeams.refreshTeamStats(doc.leagueId, doc.seasonId, doc.homeTeamId);
  Modules.server.seasonLeagueTeams.refreshTeamStats(doc.leagueId, doc.seasonId, doc.awayTeamId);
});

Games.after.update((userId, doc, fieldNames, modifier, options) => {
  Modules.server.seasonLeagueTeams.refreshTeamStats(doc.leagueId, doc.seasonId, doc.homeTeamId);
  Modules.server.seasonLeagueTeams.refreshTeamStats(doc.leagueId, doc.seasonId, doc.awayTeamId);
}, { fetchPrevious: false });


/* Access control */
if (Meteor.isServer) {
  Games.allow({
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

  Games.deny({
    insert(userId, doc) {
      return true;
    },

    update(userId, doc, fieldNames, modifier) {
      return true;
    },

    remove(userId, doc) {
      return true;
    },
  });
}
