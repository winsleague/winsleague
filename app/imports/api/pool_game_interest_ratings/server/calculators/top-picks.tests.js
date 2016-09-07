/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { assert } from 'chai';

import log from '../../../../utils/log';

import TopPicks from './top-picks';

describe('Interest Rating Calculators > Top Picks', function () {
  it('should be 100 if top picks are playing each other', function () {
    assert.equal(TopPicks._calculate(1, 4).rating, 100);
  });

  it('should be 90 if bottom picks are playing each other', function () {
    assert.equal(TopPicks._calculate(28, 32).rating, 90);
  });

  it('should be 80 if close picks are playing each other', function () {
    assert.equal(TopPicks._calculate(16, 17).rating, 80);
  });

  it('should be 0 if first and last are playing each other', function () {
    assert.equal(TopPicks._calculate(1, 32).rating, 0);
  });
});
