const page = {
  getNameSelector: () => 'input[name="name"]',
  getDeleteButtonSelector: () => 'a[href="#afModal"]',
  getDeleteButtonInModalSelector: () => 'button.btn-danger', // fragile way of doing this but good enough for now
  getPoolShowSelector: () => 'h3.poolsShow',
  getHomepageSelector: () => 'h2.home',
};

describe('poolEdit page', () => {
  beforeEach(loginWithDefaultUser);
  beforeEach(createDefaultPool);
  beforeEach(goToPoolsEditPage);

  it('should edit a pool', done => {
    const name = 'Dumber';

    waitForSubscription(Pools.find(), function() {
      $(page.getNameSelector()).val(name);

      $('form').submit();

      // make sure we redirect to poolShow page
      waitForElement(page.getPoolShowSelector(), function() {

        waitForSubscription(Pools.find({ name }), function() {
          const pool = Pools.findOne({ name });
          expect(pool).not.toBe(undefined);
          log.debug(`pool: `, pool);
          expect(pool.name).toBe(name, 'name');

          done();
        });
      });
    });
  });

  it('should delete a pool', done => {
    waitForSubscription(Pools.find(), function() {
      $(page.getDeleteButtonSelector()).click();

      waitForElement(page.getDeleteButtonInModalSelector(), function() {
        Meteor.setTimeout(function () {
          // this is needed because clicking too early on the button does nothing
          // it's as if the click() handler isn't setup until the modal animates,
          // but I don't know how to detect when the click handler is ready
          $(page.getDeleteButtonInModalSelector()).click();
        }, 1000);

        waitForMissingElement(page.getDeleteButtonInModalSelector(), function() {

          // make sure we redirect to homepage
          waitForElement(page.getHomepageSelector(), function () {

            waitForEmptySubscription(Pools.find(), function() {
              done();
            });
          });
        });
      });
    });
  });
});
