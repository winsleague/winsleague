/* eslint-disable prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';

import { PoolTeamRecords } from '../pool_team_records';

Meteor.publish('poolTeamRecords.ofPool', function poolTeamRecordsOfPool(poolId, seasonId = null) {
  check(poolId, String);
  check(seasonId, Match.Maybe(String));
  if (!poolId) {
    return this.ready();
  }

  if (seasonId) {
    check(seasonId, String);
    return PoolTeamRecords.find({ poolId, seasonId });
  }
  return PoolTeamRecords.find({ poolId });
});
