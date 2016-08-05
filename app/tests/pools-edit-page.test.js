/* eslint-env mocha */
// These are Chimp globals */
/* globals browser server assert */

import { Meteor } from 'meteor/meteor';

describe('Pools.edit page ui', () => {
  beforeEach(() => {
    server.call('logout');

    browser
      .timeoutsAsyncScript(5000)
      .executeAsync(function (done) {
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
