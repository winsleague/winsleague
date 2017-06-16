/* eslint-env mocha */
// These are Chimp globals */
/* globals browser server assert */

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

const clickElement = (selector) => {
  browser.waitForVisible(selector);
  // http://stackoverflow.com/questions/29508143/selenium-element-is-not-clickable-at-point
  browser.scroll(selector);
  browser.click(selector);
};

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

    browser.waitForVisible('select#leagueTeamId');
    browser.selectByIndex('select#leagueTeamId', 3);

    browser.waitForVisible('select#pickNumber');
    browser.selectByIndex('select#pickNumber', 5);

    browser.submitForm('form');

    browser.waitForExist('h3#PoolTeams_show_title');

    const rowCount = browser.elements("//table[@id='PoolTeamPicks']/tbody/tr").value.length;
    assert.equal(rowCount, 2); // one for the original and one for the new
  });
});
