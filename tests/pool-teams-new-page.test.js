/* eslint-env mocha */
// These are Chimp globals */
/* globals browser server assert */

import { setup, timeout, clickElement } from '../.testing/chimp-shared';

describe('PoolTeams.new page ui', () => {
  beforeEach(() => {
    setup();

    // go to the Pools.show page
    clickElement('h3.Pools_show>a');

    clickElement('a#PoolTeams_new');
  });

  it('can create a pool team', () => {
    const newEmail = 'new@test.com';
    const newTeamName = 'pool team';

    browser.waitForVisible('input#userEmail', timeout);
    browser.setValue('input#userEmail', newEmail);

    browser.waitForVisible('input#userTeamName', timeout);
    browser.setValue('input#userTeamName', newTeamName);

    clickElement('#submitButton');

    browser.waitForExist('h3#PoolTeams_show_title', timeout);

    assert.equal(browser.getText('h3#PoolTeams_show_title'), newTeamName);
  });
});
