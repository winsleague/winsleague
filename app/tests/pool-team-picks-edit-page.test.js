/* eslint-env mocha */
// These are Chimp globals */
/* globals browser server assert */

import { timeout, setup, clickElement, selectElementIndex } from '../.testing/chimp-shared';

describe('PoolTeamPicks.edit page ui', () => {
  beforeEach(() => {
    setup();

    // go to the Pools.show page
    clickElement('h3.Pools_show>a');

    // go to PoolTeams.show page
    clickElement('a.PoolTeams_show:nth-Child(1)');

    // go to PoolTeamPicks.edit page
    clickElement('a.PoolTeamPicks_edit:nth-Child(1)');
  });

  it('can edit a pool team pick', () => {
    selectElementIndex('select#leagueTeamId', 4);

    const pickNumber = 6;
    selectElementIndex('select#pickNumber', pickNumber);

    $('#submitButton').click();

    browser.waitForExist('h3#PoolTeams_show_title', timeout);

    // Buffalo is team 4
    assert.equal(browser.getText('td.PoolTeamPick:nth-Child(1)'), `#${pickNumber} BUF`);
  });

  it('can delete a pool team pick', () => {
    clickElement('#delete');

    // on the modal
    clickElement('#confirmDelete');

    browser.waitForVisible('h3#PoolTeams_show_title', timeout);

    const rowCount = browser.elements("//table[@id='PoolTeamPicks']/tbody/tr").value.length;

    assert.equal(rowCount, 0);
  });
});
