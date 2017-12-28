import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Leagues = new Mongo.Collection('leagues');

Leagues.schema = new SimpleSchema({
  name: {
    type: String,
  },
  seasonGameCount: {
    type: SimpleSchema.Integer,
  },
  closeScore: {
    type: SimpleSchema.Integer,
  },
});

Leagues.attachSchema(Leagues.schema);

// Deny all client-side updates since we will be using methods to manage this collection
Leagues.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});
