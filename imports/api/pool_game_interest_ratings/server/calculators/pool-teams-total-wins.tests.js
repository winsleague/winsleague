/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { assert } from 'chai';

import PoolTeamsTotalWins from './pool-teams-total-wins';

describe('Interest Rating Calculators > Pool Teams Total Wins', function () {
  it('should be 90 if owners have same wins, but in middle of the pack', function () {
    assert.equal(PoolTeamsTotalWins.calculateFromWins(10, 10, 20, 0).rating, 90);
  });

  it('should be 100 if owners have same wins, but in top of the pack', function () {
    assert.equal(PoolTeamsTotalWins.calculateFromWins(10, 10, 10, 0).rating, 100);
  });

  it('should be 100 if owners have same wins, but in bottom of the pack', function () {
    assert.equal(PoolTeamsTotalWins.calculateFromWins(2, 2, 10, 2).rating, 95);
  });

  it('should be 80 if owners have 1 win difference, but in middle of the pack', function () {
    assert.equal(PoolTeamsTotalWins.calculateFromWins(10, 9, 20, 0).rating, 80);
  });
});
