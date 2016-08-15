/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { assert } from 'chai';

import log from '../../../../utils/log';

import TopPicks from './top-picks';

describe('Interest Rating Calculators > Top Picks', function () {
  it('should be 100 if top 2 picks are playing each other', function () {
    assert.equal(TopPicks._rating(1, 2), 100);
  });

  it('should be 0 if bottom 2 picks are playing each other', function () {
    assert.equal(TopPicks._rating(31, 32), 0);
  });

  it('should be 50 if middle 2 picks are playing each other', function () {
    assert.equal(TopPicks._rating(16, 17), 50);
  });
});
