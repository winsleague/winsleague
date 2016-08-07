/* eslint-disable prefer-arrow-callback func-names */

import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { ReactiveAggregate } from 'meteor/jcbernack:reactive-aggregate';

import { Pools } from '../pools';
import { PoolTeams } from '../../pool_teams/pool_teams';

Meteor.publish('pools.single', function (_id) {
  check(_id, Match.Maybe(String)); // not sure why we need .Maybe
  if (!_id) return this.ready();
  return Pools.find(_id);
});

Meteor.publish('pools.ofUserAsCommissioner', function (userId) {
  check(userId, Match.Maybe(String)); // not sure why we need .Maybe
  if (!userId) return this.ready();

  // add Pools whose commissioner is userId
  return Pools.find({ commissionerUserId: userId });
});

Meteor.publish('pools.ofUserPoolTeams', function (userId) {
  // add PoolTeams who are owned by userId
  check(userId, Match.Maybe(String)); // not sure why we need .Maybe
  if (!userId) return this.ready();

  ReactiveAggregate(this, PoolTeams, [
      {
        $match: {
          userId: userId,
        },
      },
      {
        $group: {
          _id: '$poolId',
        },
      },
    ],
    {
      observeSelector: { userId }, // only observe PoolTeams for this user (perf reasons)
      clientCollection: 'pools',
    }
  );
});
