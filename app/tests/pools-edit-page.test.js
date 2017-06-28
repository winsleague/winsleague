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

describe('Pools.edit page ui', () => {
  beforeEach(() => {
    setup();

    // go to the Pools.show page
    clickElement('h3.Pools_show>a');
  });

  it('can edit a pool', () => {
    browser.waitForVisible('#Pools_title', timeout);
    const oldTitle = browser.getText('#Pools_title');

    clickElement('a#Pools_edit');

    browser.waitForExist('input[name="name"]', timeout);
    browser.waitForValue('input[name="name"]', timeout);

    // needed because we prepend the seasonYear to name
    const oldName = browser.getValue('input[name="name"]');
    const append = ' blah';
    const newName = `${oldName}${append}`;
    const newTitle = `${oldTitle}${append}`;

    browser.setValue('input[name="name"]', newName);
    browser.submitForm('form');

    browser.waitForExist('h3.Pools_show', timeout);

    assert.equal(browser.getText('#Pools_title'), newTitle);
  });

  it('can delete a pool', () => {
    clickElement('a#Pools_edit');

    clickElement('#delete');

    // on the modal
    clickElement('#confirmDelete');

    browser.waitForVisible('h2#User_dashboard_title', timeout);

    assert.equal(browser.getUrl(), 'http://localhost:3100/?force=true');
  });
});
