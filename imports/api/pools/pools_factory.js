import { Factory } from 'meteor/dburles:factory';
import faker from 'faker';
import log from '../../utils/log';

import { Pools } from './pools';

import '../leagues/leagues_factory';
import '../users/users_factory';
import '../seasons/seasons_factory';

Factory.define('pool', Pools, {
  leagueId: Factory.get('league'),
  name: () => faker.lorem.words(),
  commissionerUserId: Factory.get('user'),
  latestSeasonId: Factory.get('season'),
}).after(factory => {
  log.debug('pool factory created:', factory);
});
