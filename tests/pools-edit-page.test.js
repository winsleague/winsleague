/* eslint-env mocha */
// These are Chimp globals */
/* globals browser assert */

import { timeout, setup, clickElement } from '../.testing/chimp-shared';

describe('Pools.edit page ui', () => {
  beforeEach(() => {
    setup();

    // go to the Pools.show page
    clickElement('h3.Pools_show>a');
  });

  it('can edit a pool', () => {
    browser.waitForVisible('#Pools_title', timeout);
    const oldTitle = browser.getText('#Pools_title');

    clickElement('a#Pools_edit');

    browser.waitForExist('input[name="name"]', timeout);
    browser.waitForValue('input[name="name"]', timeout);

    // needed because we prepend the seasonYear to name
    const oldName = browser.getValue('input[name="name"]');
    const append = ' blah';
    const newName = `${oldName}${append}`;
    const newTitle = `${oldTitle}${append}`;

    browser.setValue('input[name="name"]', newName);
    clickElement('#submitButton');

    browser.waitForExist('h3.Pools_show', timeout);

    assert.equal(browser.getText('#Pools_title'), newTitle);
  });

  it('can delete a pool', () => {
    clickElement('a#Pools_edit');

    clickElement('#delete');

    // on the modal
    clickElement('#confirmDelete');

    browser.waitForVisible('h2#User_dashboard_title', timeout);

    assert.equal(browser.getUrl(), 'http://localhost:3100/?force=true');
  });
});
