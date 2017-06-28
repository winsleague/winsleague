/* eslint-env mocha */
// These are Chimp globals */
/* globals browser server assert */

import { timeout, clickElement } from '../.testing/chimp-shared';

const setup = () => {
  // we must navigate to client first so Meteor methods are available
  browser.url('http://localhost:3100');

  browser.timeouts('script', 5000);
  browser.timeouts('implicit', 5000);
  browser.timeouts('page load', 5000);

  server.call('logout');

  browser.executeAsync(function (done) {
    Meteor.logout(done);
  });

  server.call('generateFixtures');

  browser.executeAsync(function (done) {
    Meteor.loginWithPassword('test@test.com', 'test', done);
  });

  browser.url('http://localhost:3100');
};

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
    browser.submitForm('form');

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
