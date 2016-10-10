/* eslint-env mocha */
// These are Chimp globals */
/* globals browser server assert */

const setup = () => {
  // we must navigate to client first so Meteor methods are available
  browser.url('http://localhost:3100');

  browser.timeouts('implicit', 5000);

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
    browser.waitForExist('input[name="userTeamName"]');
    browser.waitForValue('input[name="userTeamName"]');

    const newTeamName = 'new name';

    browser.setValue('input[name="userTeamName"]', newTeamName);
    browser.submitForm('form');

    browser.waitForExist('h3#PoolTeams_show_title');

    assert.equal(browser.getText('h3#PoolTeams_show_title'), newTeamName);
  });

  it('can delete a pool team', () => {
    clickElement('a.btn-danger');

    // on the modal
    clickElement('button.btn-danger');

    browser.waitForVisible('h2#Pools_title');

    const rowCount = browser.elements("//table[@id='Pools_wins']/tbody/tr").value.length;

    assert.equal(rowCount, 0);
  });
});
