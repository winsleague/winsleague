Pools = new Mongo.Collection('pools');

Pools.attachSchema(new SimpleSchema({
  leagueId: {
    type: String,
    label: "League",
    autoform: {
      type: "select-radio-inline"
    }
  },
  seasonId: {
    type: String,
    autoValue: function() {
      if (this.isInsert) {
        // select latest season for league
        const leagueIdField = this.field("leagueId");
        if (leagueIdField.isSet) {
          const leagueId = leagueIdField.value;
          const latestSeason = Seasons.findOne({leagueId}, {sort: ["year", "desc"]});
          return latestSeason._id;
        } else {
          this.unset();
        }
      }
    }
  },
  name: { type: String, max: 50 },
  commissionerUserId: {
    type: String,
    autoValue: function() {
      if (this.isInsert && this.isSet == false) {
        return Meteor.userId(); // so we can easily stub this in tests
      }
    }
  },
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

if (Meteor.isServer) {
  Pools.allow({
    insert: function (userId, doc) {
      return true;
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
      return false;
    },

    update: function (userId, doc, fieldNames, modifier) {
      return true;
    },

    remove: function (userId, doc) {
      return true;
    }
  });
}
