/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { assert } from 'chai';
import { Factory } from 'meteor/dburles:factory';

import { PoolTeams } from '../../pool_teams/pool_teams';
import { Pools } from '../pools';
import './hooks';

describe('Pools Hooks', function () {
  this.timeout(10000);

  it('should remove its PoolTeams when Pool is removed', function () {
    const poolTeam = Factory.create('poolTeam');
    const { poolId } = poolTeam;

    let poolTeamsCount = PoolTeams.find({ poolId }).count();
    assert.equal(poolTeamsCount, 1);

    Pools.remove(poolId);

    poolTeamsCount = PoolTeams.find({ poolId }).count();
    assert.equal(poolTeamsCount, 0);
  });
});
