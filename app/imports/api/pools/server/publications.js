/* eslint-disable prefer-arrow-callback func-names */

import { Meteor } from 'meteor/meteor';

import { Pools } from '../pools';
import { PoolTeams } from '../../pool_teams/pool_teams';

Meteor.publish('pools.single', function(_id) {
  if (!_id) return this.ready();
  check(_id, String);
  return Pools.find(_id);
});

Meteor.publish('pools.ofUser', function(userId) {
  const self = this;
  if (!userId) return this.ready();
  check(userId, String);

  // add Pools whose commissioner is userId
  const commissionerHandle = Pools.find({ commissionerUserId: userId }).observeChanges({
    added(id, fields) {
      self.added('pools', id, fields);
    },
    removed(id) {
      self.removed('pools', id);
    },
    // don't care about changed
  });

  // add PoolTeams who are owned by userId
  const usersHandle = PoolTeams.find({ userId }).observeChanges({
    added(id, fields) {
      const pool = Pools.findOne(fields.poolId);
      self.added('pools', pool._id, pool);
    },
    // don't care about changed or removed since it's rare
  });

  self.ready();

  // Stop observing the cursor when client unsubs.
  // Stopping a subscription automatically takes
  // care of sending the client any removed messages.
  self.onStop(() => {
    commissionerHandle.stop();
    usersHandle.stop();
  });
});
