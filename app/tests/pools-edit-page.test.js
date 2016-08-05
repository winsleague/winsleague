/* eslint-env mocha */
// These are Chimp globals */
/* globals browser server assert */

describe('pool edit page ui @watch', () => {
  beforeEach(() => {
    browser.url('http://localhost:3000');
    server.call('generateFixtures');

    // login
    console.log('0');
    browser.waitForExist('button#at-nav-button');
    console.log('1');
    browser.click('button#at-nav-button');
    console.log('2');
    browser.setValue('input#at-field-email', 'test@test.com');
    console.log('3');
    browser.setValue('input#at-field-password', 'test');
    console.log('4');
    browser.click('.button#at-btn');
    console.log('5');
    browser.waitForExist('#login-name-link');
    console.log('6');


    // browse to pool
  });

  it('can create a list @watch', () => {
    const name = 'Dumber';



    // client.click('.js-new-list');

    // assert.equal(countLists(), initialCount + 1);
  });
});
