describe("The homepage", function() {
  it("should have a title", function() {
    expect($('h2').text()).toEqual('Leaderboard');
  })
});
