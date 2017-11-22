import { Factory } from 'meteor/dburles:factory';
import faker from 'faker';
import log from '../../utils/log';

import { PoolTeams } from './pool_teams';
import { Pools } from '../pools/pools';
import { Seasons } from '../seasons/seasons';

import '../seasons/seasons_factory';
import '../pools/pools_factory';
import '../users/users_factory';

Factory.define('poolTeam', PoolTeams, {
  seasonId: Factory.get('season'),
  poolId: Factory.get('pool'),
  userId: Factory.get('user'),
  userTeamName: () => faker.company.companyName(),
  teamSummary: () => faker.company.companyName(),
}).after(factory => {
  const pool = Pools.findOne(factory.poolId);
  const season = Seasons.findOne(factory.seasonId);
  season.leagueId = pool.leagueId;

  log.debug('poolTeam factory created:', factory);
});
