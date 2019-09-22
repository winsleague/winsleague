import { Factory } from 'meteor/dburles:factory';
import log from '../../utils/log';

import { PoolGameInterestRatings } from './pool_game_interest_ratings';

Factory.define('pool_game_interest_rating', PoolGameInterestRatings, {
  // TODO
}).after((factory) => {
  log.debug('pool game interest rating factory created:', factory);
});
