// These are Chimp globals */
/* globals browser assert */

import {
  timeout, setup, clickElement, selectElementIndex,
} from '../.testing/chimp-shared';

describe('PoolTeamPicks.new page ui', () => {
  beforeEach(() => {
    setup();

    // go to the Pools.show page
    clickElement('h3.Pools_show>a');

    // go to PoolTeams.show page
    clickElement('a.PoolTeams_show:nth-Child(1)');

    // go to PoolTeamPicks.new page
    clickElement('a#PoolTeamPicks_new');
  });

  it('can create a pool team pick', () => {
    const pickNumber = 5;

    selectElementIndex('select#leagueTeamId', 3);

    selectElementIndex('select#pickNumber', pickNumber);

    clickElement('#submitButton');

    browser.waitForExist('h3#PoolTeams_show_title', timeout);

    const rowCount = browser.elements("//table[@id='PoolTeamPicks']/tbody/tr").value.length;
    assert.equal(rowCount, 2); // one for the original and one for the new
  });
});
