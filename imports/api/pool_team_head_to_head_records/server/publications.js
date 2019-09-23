import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';

import { PoolTeamHeadToHeadRecords } from '../pool_team_head_to_head_records';

Meteor.publish('poolTeamHeadToHeadRecords.ofPool', function poolTeamHeadToHeadRecordsOfPool(poolId, seasonId = null) {
  check(poolId, String);
  check(seasonId, Match.Maybe(String));
  if (!poolId) {
    return this.ready();
  }

  if (seasonId) {
    check(seasonId, String);
    return PoolTeamHeadToHeadRecords.find({ poolId, seasonId });
  }
  return PoolTeamHeadToHeadRecords.find({ poolId });
});
