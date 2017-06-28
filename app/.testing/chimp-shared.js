const timeout = 2000;

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

export { timeout, clickElement, selectElementIndex }
