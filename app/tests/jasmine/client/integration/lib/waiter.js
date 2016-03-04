waitForElement = (selector, successCallback) => {
  log.debug(`waitForElement called for ${selector}`);
  const checkInterval = 50;
  const timeoutInterval = jasmine.DEFAULT_TIMEOUT_INTERVAL;
  const startTime = Date.now();
  const intervalId = Meteor.setInterval(function () {
    if (Date.now() > startTime + timeoutInterval) {
      Meteor.clearInterval(intervalId);
      // Jasmine will handle the test timeout error
    } else if ($(selector).length > 0) {
      Meteor.clearInterval(intervalId);
      successCallback();
    }
  }, checkInterval);
};

waitForMissingElement = (selector, successCallback) => {
  log.debug(`waitForMissingElement called for ${selector}`);
  const checkInterval = 100;
  const timeoutInterval = jasmine.DEFAULT_TIMEOUT_INTERVAL;
  const startTime = Date.now();
  const intervalId = Meteor.setInterval(function () {
    if (Date.now() > startTime + timeoutInterval) {
      Meteor.clearInterval(intervalId);
      // Jasmine will handle the test timeout error
    } else if ($(selector).length === 0) {
      Meteor.clearInterval(intervalId);
      successCallback();
    }
  }, checkInterval);
};

waitForSubscription = (query, successCallback) => {
  log.debug('waitForSubscription called');
  const checkInterval = 100;
  const timeoutInterval = jasmine.DEFAULT_TIMEOUT_INTERVAL;
  const startTime = Date.now();
  const intervalId = Meteor.setInterval(function () {
    if (Date.now() > startTime + timeoutInterval) {
      Meteor.clearInterval(intervalId);
      // Jasmine will handle the test timeout error
    } else if (query.count() > 0) {
      Meteor.clearInterval(intervalId);
      successCallback();
    }
  }, checkInterval);
};

waitForEmptySubscription = (query, successCallback) => {
  log.debug('waitForEmptySubscription called');
  const checkInterval = 100;
  const timeoutInterval = jasmine.DEFAULT_TIMEOUT_INTERVAL;
  const startTime = Date.now();
  const intervalId = Meteor.setInterval(function () {
    if (Date.now() > startTime + timeoutInterval) {
      Meteor.clearInterval(intervalId);
      // Jasmine will handle the test timeout error
    } else if (query.count() == 0) {
      Meteor.clearInterval(intervalId);
      successCallback();
    }
  }, checkInterval);
};

