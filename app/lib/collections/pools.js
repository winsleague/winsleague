Pools = new Mongo.Collection('pools');

Pools.attachSchema(new SimpleSchema({
  leagueId: {
    type: String,
    label: 'League',
    autoform: {
      type: 'select-radio-inline',
    },
  },
  name: { type: String, max: 50 },
  commissionerUserId: {
    type: String,
    autoValue() {
      if (this.isInsert && this.isSet === false) {
        return Meteor.userId(); // so we can easily stub this in tests
      }
    },
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

if (Meteor.isServer) {
  Pools.allow({
    insert(userId, doc) {
      return true;
    },

    update(userId, doc, fieldNames, modifier) {
      return (userId === doc.commissionerUserId);
    },

    remove(userId, doc) {
      return false;
    },
  });
}
