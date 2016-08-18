/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { assert } from 'chai';

import log from '../../../../utils/log';

import TopPicks from './top-picks';

describe('Interest Rating Calculators > Top Picks', function () {
  it('should be 100 if top picks are playing each other', function () {
    assert.equal(TopPicks._rating(1, 4), 100);
  });

  it('should be 90 if bottom picks are playing each other', function () {
    assert.equal(TopPicks._rating(28, 32), 90);
  });

  it('should be 80 if close picks are playing each other', function () {
    assert.equal(TopPicks._rating(16, 17), 80);
  });

  it('should be 0 if first and last are playing each other', function () {
    assert.equal(TopPicks._rating(1, 32), 0);
  });
});
