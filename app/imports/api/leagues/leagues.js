import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Factory } from 'meteor/dburles:factory';
import { Random } from 'meteor/random';
import faker from 'faker';
import log from '../../utils/log';

export const Leagues = new Mongo.Collection('leagues');

Leagues.schema = new SimpleSchema({
  name: {
    type: String,
  },
  seasonGameCount: {
    type: Number,
  },
  closeScore: {
    type: Number,
  },
});

Leagues.attachSchema(Leagues.schema);

// Deny all client-side updates since we will be using methods to manage this collection
Leagues.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Factory.define('league', Leagues, {
  name: () => `${faker.lorem.word()}-${Random.id()}`, // faker is not guaranteed to be random
  seasonGameCount: 16,
  closeScore: 3,
}).after((league) => {
  log.debug('league factory created:', league);
});
