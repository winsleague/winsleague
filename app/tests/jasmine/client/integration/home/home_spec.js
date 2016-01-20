describe('The homepage', () => {
  beforeEach(goToHomePage);

  it('should have a title', (done) => {
    setTimeout(() => {
      expect($('h2').text()).toEqual('Simple Fantasy Sports');
      done();
    }, DEFAULT_DELAY);
  });
});
