Meteor.publish('pools.single', function(_id) {
  if (!_id) return this.ready();
  check(_id, String);
  return Pools.find(_id);
});

Meteor.publish('pools.ofUser', function(userId) {
  if (!userId) return this.ready();
  check(userId, String);
  return Pools.find({ commissionerUserId: userId }, { fields: { _id: 1, name: 1 } });
  // TODO: this should also return Pools that users are a part of, but aren't a commissioner in
});
