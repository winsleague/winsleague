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

describe('Pools.edit page ui', () => {
  beforeEach(() => {
    setup();

    // go to the Pools.show page
    clickElement('h3.Pools_show>a');
  });

  it('can edit a pool', () => {
    browser.waitForVisible('#Pools_title');
    const oldTitle = browser.getText('#Pools_title');

    clickElement('a#Pools_edit');

    browser.waitForExist('input[name="name"]');
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

  it('can delete a pool', () => {
    clickElement('a#Pools_edit');

    clickElement('a.btn-danger');

    // on the modal
    clickElement('button.btn-danger');

    browser.waitForVisible('h2#User_dashboard_title');

    assert.equal(browser.getUrl(), 'http://localhost:3100/?force=true');
  });
});
