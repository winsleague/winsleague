const timeout = 2000;

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
  browser.waitUntil(function () {
    return browser.execute(function () {
        return document.readyState;
      }).value === 'complete';
  }, 5000, 'expected page to be loaded by now');

  browser.waitForVisible(selector, timeout);
  // http://stackoverflow.com/questions/29508143/selenium-element-is-not-clickable-at-point
  browser.scroll(selector);
  browser.click(selector);
};

const selectElementIndex = (selector, index) => {
  browser.waitUntil(function () {
    return browser.execute(function () {
        return document.readyState;
      }).value === 'complete';
  }, 5000, 'expected page to be loaded by now');

  browser.waitForVisible(selector, timeout);
  // http://stackoverflow.com/questions/29508143/selenium-element-is-not-clickable-at-point
  browser.scroll(selector);
  browser.selectByIndex(selector, index);
};

export { timeout, setup, clickElement, selectElementIndex }
