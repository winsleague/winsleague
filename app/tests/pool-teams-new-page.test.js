/* eslint-env mocha */
// These are Chimp globals */
/* globals browser server assert */

const setup = () => {
  // we must navigate to client first so Meteor methods are available
  browser.url('http://localhost:3100');

  browser.timeouts('script', 5000);

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

const clickElement = (selector) => {
  browser.waitForVisible(selector);
  // http://stackoverflow.com/questions/29508143/selenium-element-is-not-clickable-at-point
  browser.scroll(selector);
  browser.click(selector);
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

    browser.waitForVisible('input#userEmail');
    browser.setValue('input#userEmail', newEmail);

    browser.waitForVisible('input#userTeamName');
    browser.setValue('input#userTeamName', newTeamName);

    browser.submitForm('form');

    browser.waitForExist('h3#PoolTeams_show_title');

    assert.equal(browser.getText('h3#PoolTeams_show_title'), newTeamName);
  });
});
