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

describe('Pools.new page ui', () => {
  beforeEach(() => {
    setup();

    clickElement('a#Pools_new_link');
  });

  it('can create a pool', () => {
    const newTitle = 'pool name';

    browser.waitForVisible('input#name');
    browser.setValue('input#name', newTitle);

    browser.submitForm('form');

    browser.waitForExist('h3.Pools_show');

    assert.equal(browser.getText('#Pools_title'), `2015 ${newTitle}`);
  });
});
