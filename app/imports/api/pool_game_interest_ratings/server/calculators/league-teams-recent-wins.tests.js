/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { assert } from 'chai';

import LeagueTeamsRecentWins from './league-teams-recent-wins';

describe('Interest Rating Calculators > League Teams Recent Twins', function () {
  it('should be 75 if league teams have same wins, but in middle of the pack', function () {
    assert.equal(LeagueTeamsRecentWins._calculate(4, 4).rating, 75);
  });

  it('should be 85 if league teams have same wins, but in top of the pack', function () {
    assert.equal(LeagueTeamsRecentWins._calculate(10, 10).rating, 85);
  });

  it('should be 80 if league teams have same wins, but in bottom of the pack', function () {
    assert.equal(LeagueTeamsRecentWins._calculate(1, 1).rating, 80);
  });

  it('should be 65 if league teams have 1 win difference, but in middle of the pack', function () {
    assert.equal(LeagueTeamsRecentWins._calculate(5, 4).rating, 65);
  });
});
