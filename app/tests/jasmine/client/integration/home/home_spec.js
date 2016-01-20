describe('The homepage', () => {
  beforeEach(goToHomePage);

  it('should have a title', () => {
    expect($('h2').text()).toEqual('Simple Fantasy Sports');
  });
});
