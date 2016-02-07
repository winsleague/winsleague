const page = {
  getNameSelector() {
    return 'input[name="name"]';
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
});
