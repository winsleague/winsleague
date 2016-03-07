SeasonLeagueTeams = new Mongo.Collection('season_league_teams');

SeasonLeagueTeams.attachSchema(new SimpleSchema({
  leagueId: {
    type: String,
  },
  seasonId: {
    type: String,
  },
  leagueTeamId: {
    type: String,
  },
  wins: {
    type: Number,
    defaultValue: 0,
  },
  losses: {
    type: Number,
    defaultValue: 0,
  },
  ties: {
    type: Number,
    defaultValue: 0,
  },
  homeWins: {
    type: Number,
    defaultValue: 0,
  },
  homeLosses: {
    type: Number,
    defaultValue: 0,
  },
  homeTies: {
    type: Number,
    defaultValue: 0,
  },
  awayWins: {
    type: Number,
    defaultValue: 0,
  },
  awayLosses: {
    type: Number,
    defaultValue: 0,
  },
  awayTies: {
    type: Number,
    defaultValue: 0,
  },
  pointsFor: {
    type: Number,
    defaultValue: 0,
  },
  pointsAgainst: {
    type: Number,
    defaultValue: 0,
  },
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


/* Helpers */
SeasonLeagueTeams.helpers({
  totalGames() {
    return this.wins + this.losses + this.ties;
  },
});


/* Access control */
if (Meteor.isServer) {
  SeasonLeagueTeams.allow({
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
