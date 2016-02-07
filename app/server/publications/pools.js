Meteor.publish('pools.single', _id => {
  check(_id, String);
  return Pools.find({ _id });
});

Meteor.publish('pools.of_user', function(userId) {
  if (!userId) return this.ready();
  check(userId, String);
  return Pools.find({ commissionerUserId: userId });
  // TODO: this should also return Pools that users are a part of, but aren't a commissioner in
});

