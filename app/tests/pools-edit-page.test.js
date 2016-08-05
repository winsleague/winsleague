/* eslint-env mocha */
// These are Chimp globals */
/* globals browser server assert */

describe('pool edit page ui @watch', () => {
  beforeEach(() => {
    browser.url('http://localhost:3100');

    console.log('1');
    server.call('logout');

    console.log('0');
    browser
      .timeoutsAsyncScript(5000)
      .executeAsync(function (done) {
      Meteor.logout(done);
    });
    console.log('2');
    server.call('generateFixtures');

    console.log('3');
    browser.executeAsync(function (done) {
      Meteor.loginWithPassword('test@test.com', 'test', done);
    });

    /*
    // login
    console.log('0');
    browser.waitForExist('button#at-nav-button');
    console.log('1');
    browser.click('button#at-nav-button');
    console.log('2');
    browser.waitForExist('input#at-field-email');
    console.log('2b');
    browser.setValue('input#at-field-email', 'test@test.com');
    console.log('3');
    browser.setValue('input#at-field-password', 'test');
    console.log('4');
    browser.click('button#at-btn');
     */
    console.log('5');
    browser.url('http://localhost:3100');
    browser.waitForExist('h3.Pools_show');
    console.log('6');


    // browse to pool
  });

  it('can create a list @watch', () => {
    const name = 'Dumber';

    assert.equal(1, 1);

    // client.click('.js-new-list');

    // assert.equal(countLists(), initialCount + 1);
  });
});
