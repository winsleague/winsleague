import { Meteor } from 'meteor/meteor';
import { log } from '../../startup/log';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Leagues } from './leagues';

const NAME_ONLY = new SimpleSchema({
  name: { type: String },
}).validator();

export const getByName = new ValidatedMethod({
  name: 'leagues.getByName',
  validate: NAME_ONLY,
  run({ name }) {
    return Leagues.findOne({ name });
  },
});

export const getIdByName = new ValidatedMethod({
  name: 'leagues.getByName',
  validate: NAME_ONLY,
  run({ name }) {
    return Leagues.findOne({ name })._id;
  },
});
