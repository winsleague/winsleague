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

describe('PoolTeamPicks.edit page ui', () => {
  beforeEach(() => {
    setup();

    // go to the Pools.show page
    browser.waitForVisible('h3.Pools_show');
    browser.click('h3.Pools_show>a');

    // go to PoolTeams.show page
    browser.waitForVisible('a.PoolTeams_show:nth-Child(1)');
    browser.click('a.PoolTeams_show:nth-Child(1)');

    // go to PoolTeamPicks.edit page
    browser.waitForVisible('a.PoolTeamPicks_edit:nth-Child(1)');
    browser.click('a.PoolTeamPicks_edit:nth-Child(1)');
  });

  it('can edit a pool team pick', () => {
    browser.waitForVisible('select#leagueTeamId');
    browser.selectByIndex('select#leagueTeamId', 4);

    const pickNumber = 6;
    browser.waitForVisible('select#pickNumber');
    browser.selectByIndex('select#pickNumber', pickNumber);

    browser.submitForm('form');

    browser.waitForExist('h3#PoolTeams_show_title');

    assert.equal(browser.getText('td.PoolTeamPick:nth-Child(1)'), pickNumber);
  });

  it('can delete a pool team pick', () => {
    browser.waitForVisible('a.btn-danger');
    browser.click('a.btn-danger');

    // on the modal
    browser.waitForVisible('button.btn-danger');
    browser.click('button.btn-danger');

    browser.waitForVisible('h3#PoolTeams_show_title');

    const rowCount = browser.elements("//table[@id='PoolTeamPicks']/tbody/tr").value.length;

    assert.equal(rowCount, 0);
  });
});
