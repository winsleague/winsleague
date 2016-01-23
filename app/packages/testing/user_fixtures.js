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

Meteor.methods({
  'fixtures/users/create': createUser,
  'fixtures/users/createDefault': createDefaultUser,
});
