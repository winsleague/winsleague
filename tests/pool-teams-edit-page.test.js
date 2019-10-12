// These are Chimpy globals */
/* globals browser assert */

import { timeout, setup, clickElement } from '../.testing/chimp-shared';

describe('PoolTeams.edit page ui', () => {
  beforeEach(() => {
    setup();

    // go to the Pools.show page
    clickElement('h3.Pools_show>a');

    // go to PoolTeams.show page
    clickElement('a.PoolTeams_show:nth-Child(1)');

    // go to PoolTeams.edit page
    clickElement('a#PoolTeams_edit');
  });

  it('can edit a pool team', () => {
    browser.waitForExist('input[name="userTeamName"]', timeout);
    browser.waitForValue('input[name="userTeamName"]', timeout);

    const newTeamName = 'new name';

    browser.setValue('input[name="userTeamName"]', newTeamName);
    clickElement('#submitButton');

    browser.waitForExist('h3#PoolTeams_show_title', timeout);

    assert.equal(browser.getText('h3#PoolTeams_show_title'), `(1) ${newTeamName}`);
  });

  it('can delete a pool team', () => {
    clickElement('#delete');

    // on the modal
    clickElement('#confirmDelete');

    browser.waitForVisible('h2#Pools_title', timeout);

    const rowCount = browser.elements("//table[@id='Pools_wins']/tbody/tr").value.length;

    assert.equal(rowCount, 0);
  });
});
