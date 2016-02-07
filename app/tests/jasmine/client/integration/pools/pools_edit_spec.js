const page = {
  getNameSelector() {
    return 'input[name="name"]';
  },
  getDeleteButtonSelector() {
    return 'a[href="#afModal"]';
  },
  getDeleteButtonInModalSelector() {
    return 'button.btn-danger'; // fragile way of doing this but good enough for now
  },
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

      waitForSubscription(Pools.find({ name }), function() {
        const pool = Pools.findOne({ name });
        expect(pool).not.toBe(undefined);
        log.info(`pool: `, pool);
        expect(pool.name).toBe(name, 'name');

        done();
      });
    });
  });

  it('should delete a pool', done => {
    waitForSubscription(Pools.find(), function() {
      $(page.getDeleteButtonSelector()).click();

      waitForElement(page.getDeleteButtonInModalSelector(), function() {
        $(page.getDeleteButtonInModalSelector()).click();
      });

      waitForEmptySubscription(Pools.find({ name }), function() {
        done();
      });
    });
  });
});
