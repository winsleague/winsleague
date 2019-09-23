/* eslint-env mocha */
// These are Chimp globals */
/* globals browser assert */

import { timeout, setup, clickElement } from '../.testing/chimp-shared';

describe('Pools.new page ui', () => {
  beforeEach(() => {
    setup();

    clickElement('a#Pools_new_link');
  });

  it('can create a pool', () => {
    const newTitle = 'pool name';

    browser.waitForVisible('input#name', timeout);
    browser.setValue('input#name', newTitle);

    clickElement('#submitButton');

    browser.waitForExist('h3.Pools_show', timeout);

    assert.equal(browser.getText('#Pools_title'), `2015 ${newTitle}`);
  });
});
