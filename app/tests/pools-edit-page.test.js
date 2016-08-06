/* eslint-env mocha */
// These are Chimp globals */
/* globals browser server assert */

describe('Pools.edit page ui', () => {
  beforeEach(() => {
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

    browser.waitForVisible('h3.Pools_show');

    browser.click('h3.Pools_show>a');
  });

  it('can edit a pool', () => {
    browser.waitForVisible('#Pools_title');
    const oldTitle = browser.getText('#Pools_title');

    browser.waitForVisible('a#Pools_edit');
    browser.click('a#Pools_edit');

    browser.waitForValue('input[name="name"]');

    // needed because we prepend the seasonYear to name
    const oldName = browser.getValue('input[name="name"]');
    const append = ' blah';
    const newName = `${oldName}${append}`;
    const newTitle = `${oldTitle}${append}`;

    browser.setValue('input[name="name"]', newName);
    browser.submitForm('form');

    browser.waitForExist('h3.Pools_show');

    assert.equal(browser.getText('#Pools_title'), newTitle);
  });
});
