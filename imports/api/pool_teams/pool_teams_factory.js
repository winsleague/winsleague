import { Factory } from 'meteor/dburles:factory';
import faker from 'faker';
import log from '../../utils/log';

import { PoolTeams } from './pool_teams';

import '../seasons/seasons_factory';
import '../pools/pools_factory';
import '../users/users_factory';

Factory.define('poolTeam', PoolTeams, {
  poolId: Factory.get('pool'),
  userId: Factory.get('user'),
  userTeamName: () => faker.company.companyName(),
  teamSummary: () => faker.company.companyName(),
}).after((factory) => {
  log.debug('poolTeam factory created:', factory);
});
