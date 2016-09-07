import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Factory } from 'meteor/dburles:factory';
import { Random } from 'meteor/random';
import faker from 'faker';
import moment from 'moment-timezone';
import log from '../../utils/log';

import { Games } from '../games/games';

export const PoolGameInterestRatings = new Mongo.Collection('pool_game_interest_ratings');

PoolGameInterestRatings.schema = new SimpleSchema({
  poolId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },

  gameId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },

  rating: {
    type: Number,
  },

  gameTitle: {
    type: String,
  },

  gameTime: {
    type: String,
    autoValue() {
      const gameId = this.field('gameId').value;
      const game = Games.findOne(gameId);
      if (!game) {
        return 'N/A';
      }
      const date = moment(game.gameDate).format('ddd M/D,');
      const est = moment(game.gameDate).tz('US/Eastern').format('ha zz');
      const pst = moment(game.gameDate).tz('US/Pacific').format('ha zz');
      return `${date} ${est}/${pst}`;
    },
  },

  justification: {
    type: String,
    optional: true, // if rating is 0, no need to put a justification
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
});

PoolGameInterestRatings.attachSchema(PoolGameInterestRatings.schema);

// Deny all client-side updates since we will be using methods to manage this collection
PoolGameInterestRatings.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Factory.define('pool_game_interest_rating', PoolGameInterestRatings, {
  // TODO
}).after(factory => {
  log.debug('pool game interest rating factory created:', factory);
});
