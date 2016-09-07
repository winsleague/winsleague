/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { Factory } from 'meteor/dburles:factory';
import log from '../../../utils/log';

import { PoolTeams } from '../../pool_teams/pool_teams';
import { Pools } from '../pools';
import './hooks';

import { assert } from 'chai';

describe('Pools Hooks', function () {
  this.timeout(5000);
  
  it('should remove its PoolTeams when Pool is removed', function () {
    const poolTeam = Factory.create('poolTeam');
    const poolId = poolTeam.poolId;

    let poolTeamsCount = PoolTeams.find({ poolId }).count();
    assert.equal(poolTeamsCount, 1);

    Pools.remove(poolId);

    poolTeamsCount = PoolTeams.find({ poolId }).count();
    assert.equal(poolTeamsCount, 0);
  });
});
