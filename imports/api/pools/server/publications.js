import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import 'meteor/reywood:publish-composite';

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

  return Pools.find({ commissionerUserId: userId });
});

Meteor.publishComposite('pools.ofUserPoolTeams', function (userId) {
  check(userId, Match.Maybe(String)); // not sure why we need .Maybe
  if (!userId) return this.ready();

  return {
    find() {
      return PoolTeams.find({
        userId: this.userId,
      }, {
        fields: { poolId: 1 },
      });
    },
    children: [{
      find(poolTeam) {
        return Pools.find({ _id: poolTeam.poolId });
      },
    }],
  };
});
