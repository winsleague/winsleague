/* eslint-env mocha */
// These are Chimp globals */
/* globals browser server assert */

describe('Pools.edit page ui', () => {
  beforeEach(() => {
    // we must navigate to client first so Meteor methods are available
    browser.url('http://localhost:3100');

    server.call('logout');

    browser.timeouts('implicit', 5000);

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

    browser.waitForVisible('a#Pools_edit');
    browser.click('a#Pools_edit');

    browser.waitForVisible('input[name="name"]');
  });

  it('can edit a pool @watch', () => {
    const name = 'Dumber';

    browser.setValue('input[name="name"]', name);
    browser.submitForm('form');

    browser.waitForVisible('h3.Pools_show');

    assert.equal(browser.getText('#Pools_title'), name);
  });
});
