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

    browser.submitForm('form');

    browser.waitForExist('h3#PoolTeams_show_title', timeout);

    assert.equal(browser.getText('h3#PoolTeams_show_title'), newTeamName);
  });
});
