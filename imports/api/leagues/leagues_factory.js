import { Factory } from 'meteor/dburles:factory';
import { Random } from 'meteor/random';
import faker from 'faker';
import log from '../../utils/log';

import { Leagues } from './leagues';

Factory.define('league', Leagues, {
  name: () => `${faker.lorem.word()}-${Random.id()}`, // faker is not guaranteed to be random
  seasonGameCount: 16,
  closeScore: 3,
}).after((league) => {
  log.debug('league factory created:', league);
});
