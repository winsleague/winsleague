Meteor.startup(() => {
  // Disable rate limiting for our test users
  //
  // As per docs.meteor.com/#/full/ddpratelimiter, "the default limits
  // login attempts, new user creation, and password resets to
  // 5 attempts every 10 seconds per connection"
  //
  // With rate limiting enabled, our tests will fail as we
  // are logging in / logging more than 5x per 10 seconds
  Accounts.removeDefaultRateLimit();
});

function createUser(userData) {
  let user = Accounts.findUserByEmail(userData.email);

  if (!user) {
    const userId = Accounts.createUser(userData);
    user = Meteor.users.findOne(userId);
  }

  return user;
}

function createDefaultUser() {
  return createUser({
    email: 'test@test.com',
    password: 'test',
  });
}

getDefaultUserId = () => {
  if (Meteor.userId()) return Meteor.userId();

  return Accounts.findUserByEmail('test@test.com')._id;
};

Meteor.methods({
  'fixtures/users/create': createUser,
  'fixtures/users/createDefault': createDefaultUser,
});
